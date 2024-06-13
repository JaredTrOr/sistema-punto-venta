const Corte = require('../models/Corte')
const Venta = require('../models/Venta')

async function getVentasDespuesCorte (event, data) {
    try {
        const cortes = await Corte.findOne()

        if (cortes) {
            //Obtener ventas después de la fecha del corte
            const [ultimoCorte] = await Corte.find().sort({_id: -1}).limit(1)
            const ventas = await Venta.find({timestamp: {$gt: ultimoCorte.tiempoFin}})
            event.reply('get-venta-despues-corte', JSON.stringify(ventas))
            console.log({success: true, message: 'Ventas desde el último corte obtenidas'})
            return
        }

        //Si no hay cortes, obtener todas las ventas
        const ventas = await Venta.find()
        event.reply('get-venta-despues-corte', JSON.stringify(ventas))
    } catch(err) {
        console.log('No se pudieron obtener las ventas despues del corte')
        console.log({success: false, message: err})
    }
}

async function createCorte (event, tituloCorte) {
    try { 
        //Obtener el último corte o la primera venta que se realizó para obtener la fecha de inicio

        //Obtener el último corte, si no hay cortes se toma la primera venta que se realizó
        //Esto solo es la primera vez que se realiza un corte

        const cortes = await Corte.findOne()

        if (cortes) {
            const [ultimoCorte] = await Corte.find().sort({_id: -1}).limit(1)
            //Checar tiempo fin
            await Corte.create({
                tituloCorte: tituloCorte,
                tiempoInicio: ultimoCorte.tiempoFin,
                tiempoFin: new Date()
            })
            console.log({success: true, message: 'Corte creado'})
            event.reply('create-corte', {success: true, message: 'Corte creado'})
            return;
        }

        const primeraVenta = await Venta.findOne();

        if (primeraVenta) {
            await Corte.create({
                tituloCorte: tituloCorte,
                tiempoInicio: primeraVenta.timestamp,
                tiempoFin: new Date()
            })
            console.log({success: true, message: 'Corte creado'})
            event.reply('create-corte', {success: true, message: 'Corte creado'})
            return;
        }

        console.log({success: false, message: 'No se pudo crear el corte porque no hay ventas registradas'})
        event.reply('create-corte', {success: false, message: 'No se pudo crear el corte porque no hay ventas registradas'})


    } catch(err) {
        console.log({success: false, message: err})
    }
}

module.exports = {
    getVentasDespuesCorte,
    createCorte
}