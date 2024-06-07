const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Venta = new Schema({
    sucursal: String,
    fechaHora: {
        type: Date,
        default: Date.now
    },
    productos: Array,
    cantidadGeneral: Number,
    totalGeneral: Number
}, {collection: 'ventas'})

module.exports = mongoose.model('Venta', Venta)



