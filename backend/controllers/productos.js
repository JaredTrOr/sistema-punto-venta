const Producto = require('../models/Producto')

async function getProductos(event, data) {
    try {
        const productos = await Producto.find();
        event.reply('get-productos', JSON.stringify({ success: true, productos }));
        console.log({success: true, message: 'getProductos: Productos obtenidos'});
    } catch(err) {
        event.reply('get-productos', JSON.stringify({ success: false, message: 'getProductos: '+err }));
        console.log({success: false, message: err});
    }
}

async function loadProductos(event, data) {
    try {
        //Borrar la colección de productos local y volver a cargarla
        await Producto.collection.drop();

        //Cargar productos obtenidos desde firebase
        await Producto.insertMany(data);
        
        console.log('Productos cargados');
        event.reply('load-productos', JSON.stringify({success: true, message: 'Productos cargados'}));
    } catch(err) {
        event.reply('load-productos', JSON.stringify({success: true, message: err}))
    }
}

module.exports = {
    getProductos,
    loadProductos
}