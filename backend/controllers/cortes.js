const Corte = require('../models/Corte')
const Venta = require('../models/Venta')
const pagination = require('../middleware/pagination');

async function getCortes(event, data) {
    try {
        const cortes = await Corte.find().sort({_id: -1});
        event.reply('get-cortes', JSON.stringify({ success: true, cortes }));
        console.log({success: true, message: 'getCortes: Cortes obtenidos'});
    } catch(err) {
        event.reply('get-cortes', JSON.stringify({ success: false, message: 'getCortes: '+err }));
        console.log({success: false, message: 'getCortes: '+err});
    }
}

async function getCortesPaginacion(event, data) {
    try {
        const result = await pagination(Corte, data.page);
        event.reply('get-cortes-paginacion', JSON.stringify(result));
    } catch(err) {
        event.reply('get-cortes', JSON.stringify({ success: false, message: 'getCortes: '+err }));
        console.log({success: false, message: 'getCortes: '+err});
    }
}

async function getCortePorFecha(event, fechaString) {

    try {
        const cortes = await Corte.find({fechaCorte: fechaString});
        event.reply('get-cortes-por-fecha', JSON.stringify({ success: true, cortes }));
        console.log({success: true, message: 'getCortesPorFecha: Cortes obtenidos por fecha'});
    } catch(err) {
        event.reply('get-cortes-por-fecha', JSON.stringify({ success: false, message: 'getCortesPorFecha'+err }));
        console.log({ success: false, message: 'getCortesPorFecha: '+err });
    }
}

async function getVentasDespuesCorte (event, data) {
    try {
        const cortes = await Corte.findOne();

        if (cortes) {
            //Obtener ventas después de la fecha del corte
            const [ultimoCorte] = await Corte.find().sort({_id: -1}).limit(1);
            const ventas = await Venta.find({timestamp: {$gt: ultimoCorte.tiempoFin}});
            event.reply('get-venta-despues-corte', JSON.stringify({ success: true, ventas }));
            console.log({success: true, message: 'getVentasDespuesCorte: Ventas desde el último corte obtenidas'});
            return;
        }

        //Si no hay cortes, obtener todas las ventas
        const ventas = await Venta.find();
        event.reply('get-venta-despues-corte', JSON.stringify({ success: true, ventas }));
    } catch(err) {
        console.log({success: false, message: 'getVentasDespuesCorte: '+err});
        event.reply('get-venta-despues-corte', JSON.stringify({ success: false, message: 'getVentasDespuesCorte: '+err }));
    }
}

async function createCorte (event, data) {
    try { 
        //Obtener el último corte o la primera venta que se realizó para obtener la fecha de inicio

        //Obtener el último corte, si no hay cortes se toma la primera venta que se realizó
        //Esto solo es la primera vez que se realiza un corte

        const corte = {
            idCorte: data.idCorte,
            sucursal: data.sucursal,
            tituloCorte: data.tituloCorte,
            fechaCorte: data.fechaCorte,
            horaCorte: data.horaCorte,
        };

        const cortes = await Corte.findOne();

        if (cortes) {
            const [ultimoCorte] = await Corte.find().sort({_id: -1}).limit(1);
            //Checar tiempo fin
            await Corte.create({
                ...corte,
                //Fecha y hora de inicio de corte
                tiempoInicio: ultimoCorte.tiempoFin,
                tiempoFin: new Date()
            });
            console.log({success: true, message: 'Corte creado'});
            event.reply('create-corte', {success: true, message: 'Corte creado'});
            return;
        }

        const primeraVenta = await Venta.findOne();

        if (primeraVenta) {
            await Corte.create({
                ...corte,
                //Fecha y hora de inicio de corte
                tiempoInicio: primeraVenta.timestamp,
                tiempoFin: new Date()
            });
            console.log({success: true, message: 'Corte creado'});
            event.reply('create-corte', {success: true, message: 'Corte creado'});
            return;
        }

        console.log({success: false, message: 'No se pudo crear el corte porque no hay ventas registradas'});
        event.reply('create-corte', {success: false, message: 'No se pudo crear el corte porque no hay ventas registradas'});


    } catch(err) {
        console.log({success: false, message: err});
    }
}

module.exports = {
    getVentasDespuesCorte,
    getCortePorFecha,
    getCortes,
    createCorte,
    getCortesPaginacion
}