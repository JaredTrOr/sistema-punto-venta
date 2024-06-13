const Venta = require('../models/Venta')
const moment = require('moment')

async function getVentas (event, data) {
    console.log('CONTROLLERS WORKING')
    try {
        const ventas = await Venta.find()
        event.reply('get-ventas', JSON.stringify(ventas))
        console.log({success: true, message: 'Ventas obtenidas'})
    } catch(err) {
        console.log({success: false, message: err})
    }
}

async function createVenta (event, data) {  
    data.fechaHora = new Date();
    try {
        await Venta.create(data)
        console.log({success: true, message: 'Venta creada'})
    } catch(err) {
        console.log({success: false, message: err})
    }
}

async function updateVentas (event,data) {
    try {
        await Venta.findByIdAndUpdate(data.id, data)
        console.log({success: true, message: 'Venta actualizada'})
    } catch(err) {
        console.log({success: false, message: err})
    }
}

async function deleteVenta (event, id) {
    try {
        await Venta.findByIdAndDelete(id)
        console.log({success: true, message: 'Venta eliminada'})
    } catch(err) {
        console.log({success: false, message: err})
    }
}

async function getVentasFecha (event, filtro) {
    try {   
        let fechaInicio = new Date();
        let fechaFin = new Date();

        switch(filtro) {
            case 'hoy':
                fechaInicio = moment().startOf('day').toDate();
                fechaFin = moment().endOf('day').toDate();
                break;

            case 'ayer':
                fechaInicio = moment().subtract(1, 'days').startOf('day').toDate();
                fechaFin = moment().subtract(1, 'days').endOf('day').toDate();
                break;
            
            case 'ultimos-7-dias':
                fechaInicio = moment().subtract(7, 'days').startOf('day').toDate();
                fechaFin = moment().endOf('day').toDate();
                break;

            case 'ultimos-30-dias':
                fechaInicio = moment().subtract(30, 'days').startOf('day').toDate();
                fechaFin = moment().endOf('day').toDate();
                break;

            case 'mes-pasado':
                fechaInicio = moment().subtract(1, 'months').startOf('month').toDate();
                fechaFin = moment().subtract(1, 'months').endOf('month').toDate();
                break;

            case 'este-año':
                fechaInicio = moment().startOf('year').toDate();
                fechaFin = moment().endOf('year').toDate();
                break;

            case 'año-pasado':
                fechaInicio = moment().subtract(1, 'years').startOf('year').toDate();
                fechaFin = moment().subtract(1, 'years').endOf('year').toDate();
                break;

            default:
                event.reply('get-ventas-select-fecha', JSON.stringify([]))

        }

        const ventas = await Venta.find({timestamp: {$gte: fechaInicio, $lte: fechaFin}})
        event.reply('get-ventas-select-fecha', JSON.stringify(ventas))
    } catch (err){
        console.log({success: false, message: err})
    }
}

module.exports = {
    getVentas,
    createVenta,
    getVentasFecha,
    updateVentas,
    deleteVenta
}