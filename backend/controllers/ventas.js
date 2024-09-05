const { logger } = require('../logger/logger');
const sucursalGlobal = require('../models/SucursalGlobal');
const Venta = require('../models/Venta');
const moment = require('moment');

async function getVentas(event, data) {
    try {
        const ventas = await Venta.find();
        event.reply('get-ventas', JSON.stringify({ success: true, ventas }));
        console.log({ success: true, message: 'getVentas: Ventas obtenidas' });
    } catch (err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getVentasGeneral, Hubo un error al obtener las venta ${err}`);
        event.reply('get-ventas', JSON.stringify({ success: false, message: 'getVentas: '+err }));
    }
}

async function getVentasPorCorte(event, data) {
    const parseData = JSON.parse(data);

    try {
        const ventas = await Venta.find({
            timestamp: {
                $gte: parseData.tiempoInicio,
                $lte: parseData.tiempoFin
            }
        });

        console.log({success: true, message: 'getVentasPorCorte: Ventas obtenidas por corte'});
        event.reply('get-ventas-por-corte', JSON.stringify({ success: true, ventas }));
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getVentasPorCorte, Hubo un error al obtener las ventas por corte ${err}`);
        event.reply('get-ventas-por-corte', JSON.stringify({ success: false, message: 'getVentasPorCorte: '+err }));
    }
}

async function getVentaPorId(event, id) {
    try {
        const venta = await Venta.findOne({idVenta: id});
        console.log({success: true, message: 'getVentasPorId: Venta obtenida por ID'});
        event.reply('get-venta-por-id', JSON.stringify({ success: true, venta }));
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getVentaPorId, Hubo un error al obtener la venta por ID ${err}`);
        event.reply('get-venta-por-id', JSON.stringify({ success: false, message: 'getVentasPorId: '+err }));
    }
}

async function createVenta(event, data) {
    try {
        await Venta.create(data);
        event.reply('create-venta', JSON.stringify({ success: true, message: 'createVenta: Venta creada' }));
    } catch (err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, createVenta, Hubo un error al realizar la venta ${err}`);
        event.reply('create-venta', JSON.stringify({ success: false, message: 'createVenta: '+err }));
    }
}

async function updateVentas(event, data) {
    try {
        await Venta.findOneAndUpdate({ idVenta: data.idVenta }, data);
        event.reply('update-venta', JSON.stringify({ success: true, message: 'updateVentas: Venta actualizada' }));
        console.log({ success: true, message: 'updateVentas: Venta actualizada' });
    } catch (err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, updateVentas, Hubo un error al actualizar las ventas ${err}`);
        event.reply('update-venta', JSON.stringify({ success: false, message: 'update-venta: '+err }));
    }
}

async function deleteVenta(event, id) {
    try {
        await Venta.findOneAndDelete({ idVenta: id });
        event.reply('delete-venta', JSON.stringify({ success: true, message: 'deleteVenta: Venta eliminada' }));
        console.log({ success: true, message: 'deleteVenta: Venta eliminada' });
    } catch (err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, deleteVenta, Hubo un error al eliminar la venta ${err}`);
        event.reply('delete-venta', JSON.stringify({ success: false, message: 'deleteVenta: '+err }));
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

    //Obtener la hora
    let horaInicio, horaFin;

    let consulta = {
        timestamp: {
            $gte: fechaInicio,
            $lte: fechaFin
        }, 
    }

    //Si se selecciona la hora de inicio
    if (filtro.filtroHoraInicio !== 'x') {
        const [hora] = filtro.filtroHoraInicio.split(':');
        let horaInt = parseInt(hora)

        horaInicio = horaInt;
        horaFin = horaInt + 1;
    }

    //Si se selecciona la hora de fin
    if (filtro.filtroHoraFin !== 'x') {
        const [hora] = filtro.filtroHoraFin.split(':');
        let horaInt = parseInt(hora)

        horaFin = horaInt;
    }

    //Si se selecciona la hora de inicio y la hora de fin realiza la consulta junto con las horas
    if (horaInicio && horaFin) {
        consulta = {
            ...consulta,
            $expr: {
                $and: [
                  { $gte: [{ $toInt: { $substr: ["$hora", 0, 2] } }, horaInicio] },
                  { $lt: [{ $toInt: { $substr: ["$hora", 0, 2] } }, horaFin] }
                ]
              }
        }
    }

    //Realizar la consulta
    try {
        const ventasFiltradas = await Venta.find(consulta);

        event.reply('get-ventas-filtradas', JSON.stringify({ success: true, ventasFiltradas }));
        console.log({success: true, message: 'getVentasFiltradas: Ventas filtradas obtenidas'});
    } catch(err) {
        logger.error(`${sucursalGlobal.getSucursal}, Backend, getVentasFiltradas, Hubo un error al obtener las ventas ${err}`);
        event.reply('get-ventas-filtradas', JSON.stringify({ success: false, message: 'getVentasFiltradas: '+err }));
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
                logger.error(`${sucursalGlobal.getSucursal}, Backend, obtenerDiaSeleccion, Hubo un error al obtener el dia de seleccion ${err}`);
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
    getVentasPorCorte,
    updateVentas,
    deleteVenta,
    getVentaPorId,

    //Usar en exportar PDF
    obtenerDiaSeleccion
}