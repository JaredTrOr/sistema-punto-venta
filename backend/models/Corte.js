const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const Corte = new Schema({
    tituloCorte: String,
    tiempoInicio: Date,
    tiempoFin: Date,
}, {collection: 'cortes'})

module.exports = mongoose.model('Corte', Corte)