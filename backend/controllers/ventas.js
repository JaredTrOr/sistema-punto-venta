const Venta = require('../models/Venta')
const moment = require('moment')

async function getVentas(event, data) {
    try {
        const ventas = await Venta.find()
        event.reply('get-ventas', JSON.stringify(ventas))
        console.log({ success: true, message: 'Ventas obtenidas' })
    } catch (err) {
        console.log({ success: false, message: err })
    }
}

async function createVenta(event, data) {
    data.fechaHora = new Date();
    try {
        await Venta.create(data)
        console.log({ success: true, message: 'Venta creada' })
    } catch (err) {
        console.log({ success: false, message: err })
    }
}

async function updateVentas(event, data) {
    try {
        await Venta.findByIdAndUpdate(data.id, data)
        console.log({ success: true, message: 'Venta actualizada' })
    } catch (err) {
        console.log({ success: false, message: err })
    }
}

async function deleteVenta(event, id) {
    try {
        await Venta.findByIdAndDelete(id)
        console.log({ success: true, message: 'Venta eliminada' })
    } catch (err) {
        console.log({ success: false, message: err })
    }
}

async function getVentasFiltradas(event, filtro) {

    /*
        De los siguientes filtros, el usuario podrá seleccionar solo uno a la vez de los días que se muestran en la lista,

        (seleccionar un día siempre va a ser requerido)
        *El más simple es por selección, la selección definira el día
            -Hoy
            -Ayer
            -Últimos 7 días
            -Últimos 30 días
            -Mes pasado

        *Filtro por día, el usuario selecciona el día por medio del input del calendario
            -01/01/2021
            -07/01/2024
            -15/12/2020

        *Filtro por rango de fechas, el usuario selecciona el rango de fechas por medio del input del calendario
            -01/01/2021 - 07/01/2021
            -15/12/2020 - 15/12/2020
            -01/01/2021 - 31/12/2021

        
        (Seleccionar un ahora es opcional, si no se selecciona se mostrarán todas las ventas del día seleccionado)
        *Filtro de la hora, una vez escogido el día se podrá seleccionar una hora, la hora siempre va a tener que ser un rango
            -3:00 - 4:00
            -10:00 - 11:00
            -15:00 - 16:00    
    */

    let fechaInicio = new Date();
    let fechaFin = new Date();

    console.log(filtro)

    //Obtener el día por selección
    if (filtro.filtroPorDia !== 'otro') {
        const { fechaI, fechaF } = await obtenerDiaSeleccion(filtro.filtroPorDia);
        fechaInicio = fechaI;
        fechaFin = fechaF;

    }

    else {

        //Obtener el día por fecha específica
        if (filtro.radioFiltroFecha === 'fecha-especifica') {
            const [anio, mes, dia] = filtro.filtroFechaEspecifica.split('-');
            const stringDate = `${anio}-${mes}-${dia}`;

            //Fecha inicio
            fechaInicio = new Date(stringDate);

            //Obtener la fecha fin para que sea el mismo día
            fechaFin = new Date(stringDate);
            fechaFin.setDate(fechaFin.getDate() + 1);
        }

        //Obtener el día por rango de fechas
        else if (filtro.radioFiltroFecha === 'fecha-rango') {
            const [anio, mes, dia] = filtro.filtroFechaInicio.split('-');
            const stringDateInicio = `${anio}-${mes}-${dia}`;

            //Fecha inicio
            fechaInicio = new Date(stringDateInicio);

            const [anioF, mesF, diaF] = filtro.filtroFechaFin.split('-');
            const stringDateFin = `${anioF}-${mesF}-${diaF}`;
            //Fecha fin
            fechaFin = new Date(stringDateFin);
        }
    }

    //Establecer la hora si existe
    // if (filtro.filtroHoraInicio !== 'x') {
    //     const [horaInicio, minutoInicio] = filtro.filtroHoraInicio.split(':');
    //     fechaInicio.setHours(horaInicio, minutoInicio);

    //     //Establecer una hora fin de una diferencia de 1 hora
    //     fechaFin.setHours(horaInicio, minutoInicio);
    //     fechaFin.setHours(fechaFin.getHours() + 1);
    // }

    // if (filtro.filtroHoraFin !== 'x') {
    //     const [horaFin, minutoFin] = filtro.filtroHoraFin.split(':');
    //     fechaFin.setHours(horaFin, minutoFin);
    // }

    // console.log(fechaInicio, fechaFin)
    // console.log(fechaInicio.getHours(), fechaFin.getHours())

    //Realizar la consulta
    try {
        const ventasFiltradas = await Venta.find({
            timestamp: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        });

        event.reply('get-ventas-filtradas', JSON.stringify(ventasFiltradas))
        console.log({success: true, message: 'Ventas filtradas obtenidas'})
    } catch(err) {
        console.log({success: false, message: err})
    }

}

async function obtenerDiaSeleccion(filtro) {
    let fechaInicio = new Date();
    let fechaFin = new Date();

    switch (filtro) {
        case 'todas':
            try {
                const primeraVenta = await Venta.findOne();
                fechaInicio = primeraVenta.timestamp;
                fechaFin = moment().endOf('day').toDate();
            } catch (err) {
                console.log(err);
            }
            break;
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
            fechaInicio = moment().startOf('day').toDate();
            fechaFin = moment().endOf('day').toDate();
            break;

    }

    return { fechaI: fechaInicio, fechaF: fechaFin };

}

module.exports = {
    getVentas,
    createVenta,
    getVentasFiltradas,
    updateVentas,
    deleteVenta
}