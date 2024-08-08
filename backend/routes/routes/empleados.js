const { ipcMain } = require('electron');
const { iniciarSesion } = require('../../controllers/empleados');

class EmpleadosRoutes {

    static inicializarRutas() {
        ipcMain.on('iniciar-sesion', iniciarSesion);
    }
}

module.exports = EmpleadosRoutes;