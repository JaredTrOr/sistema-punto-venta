const { ipcMain } = require('electron');
const { getProductos } = require('../../controllers/productos');

class ProductosRoutes {
    static inicalizarRutas () {
        ipcMain.on('get-productos', getProductos);
    }
}

module.exports = ProductosRoutes;