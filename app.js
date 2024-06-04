const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const FileHandler = require('./electron/filehandler');

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
    fileHandler.escribirArchivo(`./files/ventas/${formatearFecha(data.fecha)}.json`, data);
})

ipcMain.on('leer-ventas', async (event, fecha) => {
    const ventas = await fileHandler.leerArchivo(`./files/ventas/${formatearFecha(fecha)}.json`);
    event.reply('leer-ventas', ventas);
    console.log('FIN DEL PROCESO MAIN')
})
