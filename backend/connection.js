//Conexión con la BD
const mongoose = require('mongoose');

function connectionMongoDB() {
    mongoose.connect('mongodb://127.0.0.1:27017/POS')
    .then(param => {
        console.log(`Conexión con MONGODB con la base de datos "${param.connections[0].name}"`);
    })
    .catch(err => {
        console.log(`Ocurrio un error al conectar con mongoDB ${err}`);
    })
}

module.exports = connectionMongoDB;
