const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const { app, dialog } = require('electron');
const path = require('path');

function exportarPDF(data) {

    const options = {
        title: 'Guardar PDF',
        name: 'corte.pdf',
        defaultPath: path.join(app.getPath('documents'), `corte_${data.fecha}_${data.hora}.pdf`),
        filters: [
            { name: 'PDF Files', extensions: ['pdf'] },
        ]
    };

    //Mensaje desplegable para guardar el archivo
    dialog.showSaveDialog(options).then(({filePath}) => {
        if (filePath) {
            const doc = new PDFDocument({ margin: 30, size: 'A4' });
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            (async function () {
                console.log(data.filtros)
                doc.font("Helvetica-Bold").fontSize(14).text("PANADERIAS SAN CAYETANO");
                doc.font("Helvetica").fontSize(12).text(data.filtros ? obtenerTituloPDF(data.filtros) : data.tituloPDF);

                doc.moveDown(3);

                // Table
                const table = {
                    headers: [
                        { label: "Nombre de producto", property: 'nombreProducto', width: 150, renderer: null },
                        { label: "Cantidad", property: 'cantidad', width: 150, renderer: null },
                        { label: "Importe", property: 'importe', width: 100, renderer: null },
                        { label: "Total", property: 'total', width: 150, renderer: null },
                        {},
                        {
                            property: 'price4',
                            renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { }
                        },
                    ],
                    datas: data.ventas,

                    rows: [
                        [
                            "Total:",
                            "",
                            "",
                            `$ ${data.ventas.reduce((acc, item) => acc + item.total, 0)}`
                        ],
                    ],
                };

                // Create table
                doc.table(table, {
                    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
                    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                        doc.font("Helvetica").fontSize(8);
                        indexColumn === 0 && doc.addBackground(rectRow, '', 0.15);
                    },
                });

                // Finish and close document
                doc.end();

                writeStream.on('finish', () => {
                    console.log('PDF guardado en:', filePath);
                });
            })();
        }
    }).catch(err => {
        console.log('Save dialog error:', err);
    });
}

function obtenerTituloPDF(filtros) {
    let titulo = '';

    //Exportación de ventas de los días

    //--> Por selección
    if (filtros.filtroPorDia === 'todas') {
        titulo = 'Exportación de todas las ventas';
    }
    else if (filtros.filtroPorDia !== 'otro') titulo = `Exportación de ventas de ${filtros.filtroPorDia}`;

    else {
         //--> Por fecha específica
        if (filtros.radioFiltroFecha === 'fecha-especifica') {
            const [anio, mes, dia] = filtros.filtroFechaEspecifica.split('-');
            const fechaString = `${dia}/${mes}/${anio}`;
            titulo = `Exportación de ventas del día ${fechaString}`;
        }
    
        //--> Por rango de fechas
        else if (filtros.radioFiltroFecha === 'fecha-rango') {
            const [anioInicio, mesInicio, diaInicio] = filtros.filtroFechaInicio.split('-');
            const [anioFin, mesFin, diaFin] = filtros.filtroFechaFin.split('-');

            const fechaInicioString = `${diaInicio}/${mesInicio}/${anioInicio}`;
            const fechaFinString = `${diaFin}/${mesFin}/${anioFin}`;

            titulo = `Exportación de ventas del ${fechaInicioString} al ${fechaFinString}`;
        }

    }

    //Exportación de ventas de las horas

    if (filtros.filtroHoraInicio !== 'x' && filtros.filtroHoraFin !== 'x') 
        titulo += ` de las ${filtros.filtroHoraInicio} a las ${filtros.filtroHoraFin}`;
    else if (filtros.filtroHoraInicio !== 'x') 
        titulo += ` a las ${filtros.filtroHoraInicio}`;

    console.log(titulo)
    return titulo;

}

module.exports = exportarPDF;

