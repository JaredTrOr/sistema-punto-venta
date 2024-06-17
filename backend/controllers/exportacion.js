const exportarPDF = require('../utils/exportarPDF')
const {formatearFecha} = require('../utils/formateos')

function exportacionPDF (event, data) {
    data.fecha = formatearFecha(data.fecha);
    exportarPDF(data)
}

module.exports = {
    exportacionPDF
}