const Categoria = require('../models/Categoria');

async function getCategorias(event, data) {
    try {
        const categorias = await Categoria.find();
        console.log({success: true, message: 'getCategorias: Categorias obtenidas'});
        event.reply('get-categorias', JSON.stringify({ success: true, categorias }));
    } catch(err) {
        console.log({success: false, message: 'getCategorias: '+err});
        event.reply('get-categorias', JSON.stringify({success: false, message: 'getCategorias: '+err}));
    }
}

async function getCategoriaPorId(event, data) {
    try {
        const categoria = await Categoria.findOne({idCategoria: data.idCategoria});
        console.log({success: true, message: 'getCategoriaPorId: Categoria obtenida'});
        event.reply('get-categoria-por-id', JSON.stringify({success: true, categoria}));
    } catch(err) {
        console.log({success: false, message: 'getCategoriaPorId: '+err});
        event.reply('get-categoria-por-id', JSON.stringify({success: false, message: 'getCategoriaPorId: '+err}));
    }
}

async function createCategoria(event, data) {
    try {
        await Categoria.create(data);
        console.log({success: true, message: 'createCategoria: Categoria creada'});
        event.reply('create-categoria', {success: true, message: 'createCategoria: Categoria creada'});
    } catch(err) {
        console.log({success: false, message: 'createCategoria: '+err});
        event.reply('create-categoria', {success: false, message: 'createCategoria: '+err});
    }
}

async function updateCategoria(event,data) {
    try {
        await Categoria.findOneAndUpdate({idCategoria: data.idCategoria}, data);
        console.log({success: true, message: 'updateCategoria: Categoria actualizada'});
        event.reply('update-categoria', {success: true, message: 'updateCategoria: Categoria actualizada'});
    } catch(err) {
        console.log({success: false, message: 'updateCategoria: '+err});
        event.reply('update-categoria', {success: false, message: 'updateCategoria: '+err});
    }
}

async function deleteCategoria(event, id) {
    try {
        await Categoria.findOneAndDelete({idCategoria: id});
        console.log({success: true, message: 'deleteCategoria: Categoria eliminada'});
        event.reply('delete-categoria', {success: true, message: 'deleteCategoria: Categoria eliminada'});
    } catch(err) {
        console.log({success: false, message: 'deleteCategoria: '+err});
        event.reply('delete-categoria', {success: false, message: 'deleteCategoria: '+err});
    }
}

async function loadCategorias(event, data) {
    try {

        //Borrar colección de categorias
        await Categoria.collection.drop();

        //Cargar categorias
        await Categoria.insertMany(data);

        console.log('Categorias cargadas');
        event.reply('load-categorias', JSON.stringify({success: true, msg: 'Categorias cargadas'}));
    } catch(err) {
        console.log({success: false, message: err});
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