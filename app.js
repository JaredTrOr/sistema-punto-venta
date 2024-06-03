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
    // mainWindow.webContents.openDevTools()

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

ipcMain.on('escribir-venta', (event, data) => {
    const fechaFormateada = data.fecha.replace(/\//g, "-");
    fileHandler.escribirArchivo(`./files/ventas/${fechaFormateada}.json`, data);
})

ipcMain.on('leer-ventas', async (event, data) => {
    const ventas = await fileHandler.leerArchivo(`./files/ventas/${data}.json`);
    event.reply('leer-ventas', ventas);
})