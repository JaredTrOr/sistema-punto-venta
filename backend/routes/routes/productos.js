const { ipcMain } = require('electron');
const { getProductos, loadProductos } = require('../../controllers/productos');

class ProductosRoutes {
    static inicalizarRutas () {
        ipcMain.on('get-productos', getProductos);
        ipcMain.on('load-productos', loadProductos)
    }
}

module.exports = ProductosRoutes;