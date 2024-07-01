const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Empleado = new Schema({
    nombre: String,
    usuario: String,
    password: String
}, {collection: 'empleados'})

module.exports = mongoose.model('Empleado', Empleado)