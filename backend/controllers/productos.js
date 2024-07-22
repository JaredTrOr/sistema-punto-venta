const Producto = require('../models/Producto')

async function getProductos(event, data) {
    try {
        const productos = await Producto.find();
        event.reply('get-productos', JSON.stringify(productos));
        console.log({success: true, message: 'Productos obtenidos'});
    } catch(err) {
        console.log({success: false, message: err});
    }
}

module.exports = {
    getProductos
}