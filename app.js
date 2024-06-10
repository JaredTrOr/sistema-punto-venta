const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");

//FileHandler
const FileHandler = require('./electron/filehandler');

//MongoDB
const connectionMongoDB = require('./backend/connection')
const Venta = require('./backend/models/Venta')
const Corte = require('./backend/models/Corte')

//PDF
const exportarPDF = require('./electron/exportarPDF')

let mainWindow
const fileHandler = new FileHandler();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'electron', 'preload.js'),
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/sistema-punto-venta/browser/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    
    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.maximize();
    mainWindow.removeMenu();
}

function formatearFecha(fecha) {
    return fecha.replace(/\//g, "-");
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

// Eventos de IPC (Inter Process Communication)
ipcMain.on('escribir-venta', (event, data) => {
    //Formateo de fecha
    const fechaFormateada = formatearFecha(data.fecha);

    const rutaDirectorio = path.join(__dirname, 'files', 'ventas', `${fechaFormateada}`); //--> Ruta para crear el directorio
    fileHandler.crearDirectorio(rutaDirectorio); //--> Creación del directorio si no existe

    //Creación de rutas para el archivo general y auxiliar
    const rutaArchivo = path.join(rutaDirectorio, `${fechaFormateada}.json`); //--> Ruta para escribir el archivo general
    const rutaArchivoAuxiliar = path.join(rutaDirectorio, `auxiliar.json`); //--> Ruta para escribir el archivo auxiliar

    //Creación de archivos general y auxiliar
    fileHandler.escribirArchivo(rutaArchivo, data); //--> Escritura del archivo general
    fileHandler.escribirArchivo(rutaArchivoAuxiliar, data); //--> Escritura del archivo auxiliar
})

ipcMain.on('leer-ventas', async (event, fecha) => {
    const ventas = await fileHandler.leerArchivo(`./files/ventas/${formatearFecha(fecha)}/${formatearFecha(fecha)}.json`);
    event.reply('leer-ventas', ventas);
})

// Eventos de MongoDB

connectionMongoDB()

//Ventas
ipcMain.on('create-venta', async (event, data) => {  
    data.fechaHora = new Date();
    try {
        await Venta.create(data)
        console.log({success: true, message: 'Venta creada'})
    } catch(err) {
        console.log({success: false, message: err})
    }
})

ipcMain.on('get-ventas', async (event, data) => {
    try {
        const ventas = await Venta.find()
        event.reply('get-ventas', JSON.stringify(ventas))
        console.log({success: true, message: 'Ventas obtenidas'})
    } catch(err) {
        console.log({success: false, message: err})
    }
})

ipcMain.on('update-ventas', async (event,data) => {
    try {
        await Venta.findByIdAndUpdate(data.id, data)
        console.log({success: true, message: 'Venta actualizada'})
    } catch(err) {
        console.log({success: false, message: err})
    }
})

ipcMain.on('delete-venta', async (event, id) => {
    try {
        await Venta.findByIdAndDelete(id)
        console.log({success: true, message: 'Venta eliminada'})
    } catch(err) {
        console.log({success: false, message: err})
    }
})

//Cortes
ipcMain.on('get-venta-despues-corte', async (event, data) => {
    try {
        const cortes = await Corte.findOne()

        if (cortes) {
            //Obtener ventas después de la fecha del corte
            const [ultimoCorte] = await Corte.find().sort({_id: -1}).limit(1)
            const ventas = await Venta.find({timestamp: {$gt: ultimoCorte.tiempoFin}})
            event.reply('get-venta-despues-corte', JSON.stringify(ventas))
            console.log({success: true, message: 'Ventas desde el último corte obtenidas'})
            return
        }

        //Si no hay cortes, obtener todas las ventas
        const ventas = await Venta.find()
        event.reply('get-venta-despues-corte', JSON.stringify(ventas))
    } catch(err) {
        console.log('No se pudieron obtener las ventas despues del corte')
        console.log({success: false, message: err})
    }
})

ipcMain.on('create-corte', async (event, tituloCorte) => {
    try { 
        //Obtener el último corte o la primera venta que se realizó para obtener la fecha de inicio

        //Obtener el último corte, si no hay cortes se toma la primera venta que se realizó
        //Esto solo es la primera vez que se realiza un corte

        const cortes = await Corte.findOne()

        if (cortes) {
            const ultimoCorte = await Corte.find().sort({_id: -1}).limit(1)
            await Corte.create({
                tituloCorte: tituloCorte,
                tiempoInicio: ultimoCorte.tiempoFin,
                tiempoFin: new Date()
            })
            console.log({success: true, message: 'Corte creado'})
            event.reply('create-corte', {success: true, message: 'Corte creado'})
            return;
        }

        const primeraVenta = await Venta.findOne();

        if (primeraVenta) {
            await Corte.create({
                tituloCorte: tituloCorte,
                tiempoInicio: primeraVenta.timestamp,
                tiempoFin: new Date()
            })
            console.log({success: true, message: 'Corte creado'})
            event.reply('create-corte', {success: true, message: 'Corte creado'})
            return;
        }

        console.log({success: false, message: 'No se pudo crear el corte porque no hay ventas registradas'})
        event.reply('create-corte', {success: false, message: 'No se pudo crear el corte porque no hay ventas registradas'})


    } catch(err) {
        console.log({success: false, message: err})
    }
})

// Eventos de PDF
ipcMain.on('exportar-pdf', async (event, data) => {
    exportarPDF(data)
})