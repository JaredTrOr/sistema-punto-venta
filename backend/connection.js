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
    mongoose.connect(process.env.MONGO_LOCAL_URI)
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
    });
}

async function databaseExists() {
    try {
        const admin = mongoose.connection.db.admin();
        const databases = await admin.listDatabases();
        const dbNames = databases.databases.map(db => db.name);
        return dbNames.includes('POS'); 
    } catch (err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, databaseExists, Hubo un error al verificar la existencia de la base de datos ${err}`);
        return false;
    }
}

async function checkToLoadMongoDBDatabase() {

    const configFilePath = sucursalGlobal.isDev 
        ? path.join(__dirname, '../config.json')
        : path.join(process.resourcesPath, 'config.json');

    const dbPath = sucursalGlobal.isDev  
        ? path.join(__dirname, '../db')
        : path.join(process.resourcesPath, 'db');

    try {
        const configFile = await fileHandler.leerArchivo(configFilePath);
        if (configFile.firstRun) {

            if (await databaseExists()) {
                await fileHandler.actualizarFirstTimeFalse(configFilePath);
                logger.info(`${sucursalGlobal.getSucursal}, La base de datos ya existe, por lo tanto no se tiene que cargar denuevo ni modificar la BD existente`);
                return;
            }

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
