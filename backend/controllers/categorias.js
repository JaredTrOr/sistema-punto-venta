const Categoria = require('../models/Categoria');

async function getCategorias(event, data) {
    try {
        const categorias = await Categoria.find();
        console.log({success: true, message: 'Categorias obtenidas'})
        event.reply('get-categorias', JSON.stringify(categorias));
    } catch(err) {
        console.log({success: false, message: err})
    }
}

module.exports = {
    getCategorias
}