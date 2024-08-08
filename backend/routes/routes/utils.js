const { ipcMain } = require('electron');
const { exportacionPDF } = require('../../controllers/exportacion');
// const { getImpresoras } = require('./backend/controllers/tickets');

class UtilsRoutes {
    static inicalizarRutas () {
        ipcMain.on('exportar-pdf', exportacionPDF);
    } 
}