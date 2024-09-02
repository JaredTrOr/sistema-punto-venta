const { ipcMain } = require('electron');
const { logger } = require('../../logger/logger');

class LoggerRoutes {
    static inicializarRutas() {
        ipcMain.on('log-info', (event, message) => logger.info(message));
        ipcMain.on('log-error', (event, message) => logger.error(message));
    }    
}

module.exports = LoggerRoutes;