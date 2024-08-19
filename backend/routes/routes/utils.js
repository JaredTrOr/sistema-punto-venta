const { ipcMain } = require('electron');
const { exportacionPDF, imprimirTicket } = require('../../controllers/exportacion');
// const { getImpresoras } = require('./backend/controllers/tickets');

class UtilsRoutes {
    static inicalizarRutas () {
        ipcMain.on('exportar-pdf', exportacionPDF);
        ipcMain.on('imprimir-ticket', imprimirTicket);
    } 
}

module.exports = UtilsRoutes;