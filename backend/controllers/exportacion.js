const exportarPDF = require('../utils/exportarPDF');
const Impresora = require('../utils/impresora');
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

module.exports = {
    exportacionPDF,
    imprimirTicket,
    imprimirTicketCorte
}