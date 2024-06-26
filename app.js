const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const url = require("url");
const path = require("path");

//MongoDB
const connectionMongoDB = require('./backend/connection');
//Ventas controller
const { 
    getVentas, 
    getVentaPorId,
    createVenta, 
    getVentasFiltradas, 
    updateVentas, 
    deleteVenta 
} = require('./backend/controllers/ventas');
//Cortes controller
const {
    getVentasDespuesCorte, createCorte
} = require('./backend/controllers/cortes');
//Exportación controller
const { exportacionPDF } = require('./backend/controllers/exportacion');
const { iniciarSesion } = require('./backend/controllers/empleados');
const { getProductos } = require('./backend/controllers/productos');
const { 
    getCategorias,
    getCategoriaPorId,
    createCategoria,
    updateCategoria,
    deleteCategoria
} = require('./backend/controllers/categorias');

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'backend', 'utils', 'preload.js'),
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

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

// Eventos de MongoDB
connectionMongoDB()

//Login
ipcMain.on('iniciar-sesion', iniciarSesion)
//Ventas
ipcMain.on('create-venta', createVenta)
ipcMain.on('get-ventas', getVentas)
ipcMain.on('get-venta-por-id', getVentaPorId)
ipcMain.on('get-ventas-filtradas', getVentasFiltradas)
ipcMain.on('update-venta', updateVentas)
ipcMain.on('delete-venta', deleteVenta) 
//Cortes
ipcMain.on('get-venta-despues-corte', getVentasDespuesCorte)
ipcMain.on('create-corte', createCorte)
// Eventos de PDF
ipcMain.on('exportar-pdf', exportacionPDF)
//Productos
ipcMain.on('get-productos', getProductos)
//Categorias
ipcMain.on('get-categorias', getCategorias)
ipcMain.on('get-categoria-por-id', getCategoriaPorId)
ipcMain.on('create-categoria', createCategoria)
ipcMain.on('update-categoria', updateCategoria)
ipcMain.on('delete-categoria', deleteCategoria)
