const Categoria = require('../models/Categoria');
const { logger } = require('../logger/logger');
const sucursalGlobal = require('../models/SucursalGlobal');

async function getCategorias(event, data) {
    try {
        const categorias = await Categoria.find();
        event.reply('get-categorias', JSON.stringify({ success: true, categorias }));
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getCateogiras, Hubo un error al obtener las categorias ${err}`);
        event.reply('get-categorias', JSON.stringify({success: false, message: 'getCategorias: '+err}));
    }
}

async function getCategoriaPorId(event, data) {
    try {
        const categoria = await Categoria.findOne({idCategoria: data.idCategoria});
        console.log({success: true, message: 'getCategoriaPorId: Categoria obtenida'});
        event.reply('get-categoria-por-id', JSON.stringify({success: true, categoria}));
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getCategoriaPorId, Hubo un error al obtener la categoria por ID ${err}`);
        event.reply('get-categoria-por-id', JSON.stringify({success: false, message: 'getCategoriaPorId: '+err}));
    }
}

async function createCategoria(event, data) {
    try {
        await Categoria.create(data);
        console.log({success: true, message: 'createCategoria: Categoria creada'});
        event.reply('create-categoria', {success: true, message: 'createCategoria: Categoria creada'});
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, createCategoria, Hubo un error al crear la categoria ${err}`);
        event.reply('create-categoria', {success: false, message: 'createCategoria: '+err});
    }
}

async function updateCategoria(event,data) {
    try {
        await Categoria.findOneAndUpdate({idCategoria: data.idCategoria}, data);
        console.log({success: true, message: 'updateCategoria: Categoria actualizada'});
        event.reply('update-categoria', {success: true, message: 'updateCategoria: Categoria actualizada'});
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, updateCategoria, Hubo un error al actualizar la categoria ${err}`);
        event.reply('update-categoria', {success: false, message: 'updateCategoria: '+err});
    }
}

async function deleteCategoria(event, id) {
    try {
        await Categoria.findOneAndDelete({idCategoria: id});
        console.log({success: true, message: 'deleteCategoria: Categoria eliminada'});
        event.reply('delete-categoria', {success: true, message: 'deleteCategoria: Categoria eliminada'});
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, deleteCategoria, Hubo un error al eliminar la categoria ${err}`);
        event.reply('delete-categoria', {success: false, message: 'deleteCategoria: '+err});
    }
}

async function loadCategorias(event, data) {
    try {

        //Borrar colección de categorias
        await Categoria.collection.drop();

        //Cargar categorias
        await Categoria.insertMany(data);

        event.reply('load-categorias', JSON.stringify({success: true, msg: 'Categorias cargadas'}));
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, loadCategorias, Hubo un error al cargar las categorias de firebase a local ${err}`);
        event.reply('load-categorias', JSON.stringify({ success: false, message: err }))
    }
}

module.exports = {
    getCategorias,
    getCategoriaPorId,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    loadCategorias
}