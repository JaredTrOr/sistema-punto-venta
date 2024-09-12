const FileHandler = require('../utils/filehandler');
const sucursalGlobal = require('../models/SucursalGlobal');
const path = require('path');
const fileHandler = new FileHandler();

const configFilePath = sucursalGlobal.isDev
    ? path.join(__dirname, '../../config.json')
    : path.join(process.resourcesPath, 'config.json');

async function getSucursales(event, data) {

    try {
        const data = await fileHandler.leerArchivo(configFilePath);
        event.reply('get-sucursales', JSON.stringify({
            success: true, 
            message: 'Se ha leido el archivo on éxito', 
            sucursales: data.sucursales, 
            sucursalSeleccionada: data.sucursalSeleccionada,
            path: configFilePath
        }));

    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getSucursales, Hubo un error al obtener las sucursales ${err}`);
        event.reply('get-sucursales', JSON.stringify({success: false, message: err}));
    }
}

async function getSucursalSeleccionada() {

    let sucursalSeleccionada = '';

    try {
        const data = await fileHandler.leerArchivo(configFilePath);
        sucursalSeleccionada = data.sucursalSeleccionada
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getSucursalSeleccionada, Hubo un error al obtener la sucursal seleccionada ${err}`);
    }

    return sucursalSeleccionada;
}

async function updateSucursalSeleccionada(event, data) {
    try {
       await fileHandler.actualizarArchivo(configFilePath, data);
       event.reply('update-sucursal-seleccionada', JSON.stringify({
        success: true, 
        message: 'Se ha actualizado la sucursal correctamente'
       }));

       //Cambiar variable global en caso que se actualice la sucursal seleccionada
       sucursalGlobal.setSucursal(await getSucursalSeleccionada());

    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, updateSucursalSeleccionada, Hubo un error al obtener la sucursal seleccionada ${err}`);
        event.reply('update-sucursal-seleccionada', JSON.stringify({success: false, message: err}));
    }
}

module.exports = {
    getSucursales,
    updateSucursalSeleccionada,
    getSucursalSeleccionada
}
