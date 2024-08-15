const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Producto = new Schema({
    idProducto: String,
    idProductoNumerico: Number,
    imagen: String,
    descripcion: String,
    categoria: String, 
    precio: Number,

    precioPromo: Number,
    precioMin: Number,
    status: Number
}, {collection: 'productos'})

module.exports = mongoose.model('Producto', Producto);