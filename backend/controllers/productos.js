const Producto = require('../models/Producto');
const { logger } = require('../logger/logger');
const sucursalGlobal = require('../models/SucursalGlobal');

async function getProductos(event, data) {
    try {
        const productos = await Producto.find();
        event.reply('get-productos', JSON.stringify({ success: true, productos }));
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getProductos, Hubo un error al obtener los productos ${err}`);
        event.reply('get-productos', JSON.stringify({ success: false, message: 'getProductos: '+err }));
    }
}

async function loadProductos(event, data) {
    try {
        //Borrar la colección de productos local y volver a cargarla
        await Producto.collection.drop();

        //Cargar productos obtenidos desde firebase
        await Producto.insertMany(data);
        
        event.reply('load-productos', JSON.stringify({success: true, message: 'Productos cargados'}));
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, loadProductos, Hubo un error al cargar los productos de firebase a local: ${err}`)
        event.reply('load-productos', JSON.stringify({success: true, message: err}))
    }
}

module.exports = {
    getProductos,
    loadProductos
}