//Conexión con la BD
const mongoose = require('mongoose');
const sucursalGlobal = require('./models/SucursalGlobal');
const { logger, formatoMensajeError } = require('./logger/logger');

// Requerimientos para cargar la base de datos la primera vez
const Producto = require('./models/Producto');
const Empleado = require('./models/Empleado');
const Categoria = require('./models/Categoria');
const FileHandler = require('./utils/filehandler');
const fileHandler = new FileHandler();
const path = require('path');

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

async function checkToLoadMongoDBDatabase() {

    const configFilePath = path.join(__dirname, '../config.json');
    const dbPath = path.join(__dirname, '../db');

    try {
        const configFile = await fileHandler.leerArchivo(configFilePath);
        if (configFile.firstRun) {

            //Cargar las colecciones de la base de datos por primera vez
            const productosData = await fileHandler.leerArchivo(`${dbPath}/productos.json`);
            const categoriasData = await fileHandler.leerArchivo(`${dbPath}/categorias.json`);
            const empleadosData = await fileHandler.leerArchivo(`${dbPath}/empleados.json`);

            await Producto.insertMany(productosData);
            await Categoria.insertMany(categoriasData);
            await Empleado.insertMany(empleadosData);

            //Cambiar archivo json para cambiar la bandera de primera vez
            await fileHandler.actualizarFirstTimeFalse(configFilePath);

            logger.info(`${sucursalGlobal.getSucursal}, Se cargó la base de datos por primera vez`);
        }
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, checkToLoadMongoDBDatabase, Hubo un error al leer o insertar los archivos json ${err}`);
    }
}

module.exports = { connectionMongoDB, checkToLoadMongoDBDatabase };
