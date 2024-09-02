//Conexión con la BD
const mongoose = require('mongoose');
const sucursalGlobal = require('../backend/models/SucursalGlobal');
const { logger, formatoMensajeError } = require('../backend/logger/logger');

function connectionMongoDB() {
    mongoose.connect('mongodb://127.0.0.1:27017/POS')
    .then(param => {
        logger.info(`${sucursalGlobal.getSucursal}, Conectado a la base de datos de MongoDB "${param.connections[0].name}"`);
    })
    .catch(err => {
        logger.error(
            formatoMensajeError(
                sucursalGlobal.getSucursal, 
                'Backend', 
                'connectionMongoDB', 
                `Ocurrio un error al conectar con mongoDB ${err}`
            )
        );
    })
}

module.exports = connectionMongoDB;
