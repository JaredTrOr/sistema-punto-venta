const { ipcMain } = require('electron');
const {
    getVentasDespuesCorte, 
    getCortes,
    createCorte,
    getCortePorFecha,
    getCortesPaginacion
} = require('../../controllers/cortes');

class CortesRoutes {
    static inicializarRutas () {
        ipcMain.on('get-venta-despues-corte', getVentasDespuesCorte);
        ipcMain.on('get-cortes-por-fecha', getCortePorFecha);
        ipcMain.on('get-cortes', getCortes);
        ipcMain.on('get-cortes-paginacion', getCortesPaginacion);
        ipcMain.on('create-corte', createCorte);
    }
}

module.exports = CortesRoutes;