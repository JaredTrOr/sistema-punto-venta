const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Categoria = new Schema({
    idCategoria: String,
    descripcion: String
}, {collection: 'categorias'})

module.exports = mongoose.model('Categoria', Categoria)