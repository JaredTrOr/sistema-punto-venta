const Categoria = require('../models/Categoria');

async function getCategorias(event, data) {
    try {
        const categorias = await Categoria.find();
        console.log({success: true, message: 'Categorias obtenidas'})
        event.reply('get-categorias', JSON.stringify(categorias));
    } catch(err) {
        console.log({success: false, message: err})
        event.reply('get-categorias', JSON.stringify({success: false, message: err}));
    }
}

async function getCategoriaPorId(event, data) {
    try {
        const categoria = await Categoria.findOne({idCategoria: data.idCategoria});
        console.log({success: true, message: 'Categoria obtenida'})
        event.reply('get-categoria-por-id', JSON.stringify(categoria));
    } catch(err) {
        console.log({success: false, message: err})
        event.reply('get-categoria-por-id', JSON.stringify({success: false, message: err}));
    }
}

async function createCategoria(event, data) {
    try {
        await Categoria.create(data);
        console.log({success: true, message: 'Categoria creada'})
        event.reply('create-categoria', {success: true, message: 'Categoria creada'})
    } catch(err) {
        console.log({success: false, message: err})
        event.reply('create-categoria', {success: false, message: err})
    }
}

async function updateCategoria(event,data) {
    try {
        await Categoria.findOneAndUpdate({idCategoria: data.idCategoria}, data);
        console.log({success: true, message: 'Categoria actualizada'})
        event.reply('update-categoria', {success: true, message: 'Categoria actualizada'})
    } catch(err) {
        console.log({success: false, message: err})
        event.reply('update-categoria', {success: false, message: err})
    }
}

async function deleteCategoria(event, id) {
    try {
        await Categoria.findOneAndDelete({idCategoria: id});
        console.log({success: true, message: 'Categoria eliminada'})
        event.reply('delete-categoria', {success: true, message: 'Categoria eliminada'})
    } catch(err) {
        console.log({success: false, message: err})
        event.reply('delete-categoria', {success: false, message: err})
    }
}

module.exports = {
    getCategorias,
    getCategoriaPorId,
    createCategoria,
    updateCategoria,
    deleteCategoria
}