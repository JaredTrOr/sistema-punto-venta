const { ipcMain } = require('electron');
const { exportacionPDF, imprimirTicket, imprimirTicketCorte } = require('../../controllers/exportacion');
// const { getImpresoras } = require('./backend/controllers/tickets');

class UtilsRoutes {
    static inicalizarRutas () {
        ipcMain.on('exportar-pdf', exportacionPDF);
        ipcMain.on('imprimir-ticket', imprimirTicket);
        ipcMain.on('imprimir-ticket-corte', imprimirTicketCorte);
    } 
}

module.exports = UtilsRoutes;