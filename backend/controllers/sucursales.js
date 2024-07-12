const FileHandler = require('../utils/filehandler');

const fileHandler = new FileHandler();

async function getSucursales(event, data) {

    try {
        const data = await fileHandler.leerArchivo('./config.json');
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

async function updateSucursalSeleccionada(event, data) {
    console.log('DATA')
    console.log(data);
    try {
       await fileHandler.actualizarArchivo('./config.json', data);
       event.reply('update-sucursal-seleccionada', JSON.stringify({
        success: true, 
        message: 'Se ha actualizado la sucursal correctamente'
       }));
    } catch(err) {
        console.log({success: false, message: err});
        event.reply('update-sucursal-seleccionada', JSON.stringify({success: false, message: err}));
    }
}

module.exports = {
    getSucursales,
    updateSucursalSeleccionada
}
