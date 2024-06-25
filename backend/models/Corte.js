const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const Corte = new Schema({
    idCorte: String, 
    sucursal: String,
    fechaCorte: String,
    horaCorte: String,
    tituloCorte: String,
    tiempoInicio: Date,
    tiempoFin: Date,
}, {collection: 'cortes'})

module.exports = mongoose.model('Corte', Corte)