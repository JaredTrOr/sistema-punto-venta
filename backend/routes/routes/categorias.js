const { ipcMain } = require('electron');
const { 
    getCategorias,
    getCategoriaPorId,
    createCategoria,
    updateCategoria,
    deleteCategoria
} = require('../../controllers/categorias');

class CategoriasRoutes {
    static inicializarRutas () {
        ipcMain.on('get-categorias', getCategorias);
        ipcMain.on('get-categoria-por-id', getCategoriaPorId);
        ipcMain.on('create-categoria', createCategoria);
        ipcMain.on('update-categoria', updateCategoria);
        ipcMain.on('delete-categoria', deleteCategoria);
    }
}

module.exports = CategoriasRoutes;