const { ipcMain } = require('electron');
const { 
    getVentas, 
    getVentaPorId,
    createVenta, 
    getVentasFiltradas, 
    updateVentas, 
    deleteVenta, 
    getVentasPorCorte
} = require('../../controllers/ventas');

class VentasRoutes {
    static inicializarRutas() {
        ipcMain.on('create-venta', createVenta);
        ipcMain.on('get-ventas', getVentas);
        ipcMain.on('get-venta-por-id', getVentaPorId);
        ipcMain.on('get-ventas-filtradas', getVentasFiltradas);
        ipcMain.on('update-venta', updateVentas);
        ipcMain.on('delete-venta', deleteVenta); 
        ipcMain.on('get-ventas-por-corte', getVentasPorCorte);
    }    
}

module.exports = VentasRoutes;