const FileHandler = require('../utils/filehandler');
const sucursalGlobal = require('../models/SucursalGlobal');
const path = require('path');
const fileHandler = new FileHandler();

const configFilePath = path.join(__dirname, '../../config.json');

async function getSucursales(event, data) {

    try {
        const data = await fileHandler.leerArchivo(configFilePath);
        event.reply('get-sucursales', JSON.stringify({
            success: true, 
            message: 'Se ha leido el archivo on éxito', 
            sucursales: data.sucursales, 
            sucursalSeleccionada: data.sucursalSeleccionada
        }));

    } catch(err) {
        console.log({success: false, message: err});
        event.reply('get-sucursales', JSON.stringify({success: false, message: err}));
    }
}

async function getSucursalSeleccionada() {

    let sucursalSeleccionada = '';

    try {
        const data = await fileHandler.leerArchivo(configFilePath);
        sucursalSeleccionada = data.sucursalSeleccionada
    } catch(err) {
        console.log({ success: false , message: 'Hubo un fallo al obtener la sucursal seleccionada'});
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
        console.log({success: false, message: err});
        event.reply('update-sucursal-seleccionada', JSON.stringify({success: false, message: err}));
    }
}

module.exports = {
    getSucursales,
    updateSucursalSeleccionada,
    getSucursalSeleccionada
}
