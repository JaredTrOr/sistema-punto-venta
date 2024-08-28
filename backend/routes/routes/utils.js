const { ipcMain } = require('electron');
const { 
    exportacionPDF, 
    imprimirTicket, 
    imprimirTicketCorte, 
    logInfo, 
    logError 
} = require('../../controllers/exportacion');

class UtilsRoutes {
    static inicalizarRutas () {
        ipcMain.on('exportar-pdf', exportacionPDF);
        ipcMain.on('imprimir-ticket', imprimirTicket);
        ipcMain.on('imprimir-ticket-corte', imprimirTicketCorte);
        ipcMain.on('log-info', logInfo);
        ipcMain.on('log-error', logError);
    } 
}

module.exports = UtilsRoutes;