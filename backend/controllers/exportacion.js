const exportarPDF = require('../utils/exportarPDF');
const Impresora = require('../utils/impresora');
const { formatearFecha } = require('../utils/formateos');

function exportacionPDF (event, data) {
    data.fecha = formatearFecha(data.fecha);
    exportarPDF(data);
}

function imprimirTicket(event, data) {
    const impresora = new Impresora();
    impresora.printTicket(data);
}

module.exports = {
    exportacionPDF,
    imprimirTicket
}