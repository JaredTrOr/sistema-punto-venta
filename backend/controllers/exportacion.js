const exportarPDF = require('../utils/exportarPDF');
const Impresora = require('../utils/impresora');
const logger = require('../utils/logger');
const { formatearFecha } = require('../utils/formateos');

const impresora = new Impresora();

function exportacionPDF (event, data) {
    data.fecha = formatearFecha(data.fecha);
    exportarPDF(data);
}

function imprimirTicket(event, data) {
    impresora.printTicket(data);
}

function imprimirTicketCorte(event, data) {
    impresora.printTicketCorte(data);
}

//Loggers
function logInfo(event, message) {
    logger.info(message);
}

function logError(event, message) {
    logger.error(message);
}

module.exports = {
    exportacionPDF,
    imprimirTicket,
    imprimirTicketCorte,
    logInfo,
    logError
}