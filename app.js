require('dotenv').config();
const { app, BrowserWindow, screen } = require('electron');
const url = require("url");
const path = require("path");
const Routes = require('./backend/routes/router');
const { logger } = require('./backend/logger/logger');
const sucursalGlobal = require('./backend/models/SucursalGlobal');

let mainWindow;

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'backend', 'utils', 'preload.js'),
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'assets/logo.ico')
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/sistema-punto-venta/browser/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.maximize();
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('set-zoom', { width, height }); 
    });
    
    mainWindow.removeMenu();
    // mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
    if (mainWindow === null) createWindow();
})

// Rutas y conexión con base de datos
Routes.inicializarRutas().then(() => {
    logger.info(`${sucursalGlobal.getSucursal}, Las rutas se han inicializado con exitosamente`);
});
