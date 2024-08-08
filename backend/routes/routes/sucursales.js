const { ipcMain } = require('electron');
const { 
    getSucursales,
    updateSucursalSeleccionada
} = require('../../controllers/sucursales');

class SucursalesRoutes {
    static inicializarRutas() {
        ipcMain.on('get-sucursales', getSucursales);
        ipcMain.on('update-sucursal-seleccionada', updateSucursalSeleccionada); 
    }
}

module.exports = SucursalesRoutes;