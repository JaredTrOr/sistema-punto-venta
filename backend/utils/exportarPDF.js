const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const { exec } = require('child_process');

const { v4: uuidv4 } = require('uuid');

function exportarPDF(data) {

    const myId = uuidv4();
    const fechaArreglo = data.hora.split(':')

    let doc = new PDFDocument({ margin: 30, size: 'A4' });
    const writeStream = fs.createWriteStream(`./files/corte_${data.fecha}_${fechaArreglo[0]}.${fechaArreglo[1]}.pdf`);
    doc.pipe(writeStream);

    ; (async function () {
        // Title and subtitle
        doc.font("Helvetica-Bold").fontSize(14).text("PANADERIAS SAN CAYETANO");
        doc.font("Helvetica").fontSize(12).text(data.tituloPDF);

        // Add margin between subtitle and table
        doc.moveDown(3);

        // table
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
            // complex data
            datas: data.ventas,
            // simple data
            rows: [
                [
                    "Total:",
                    "",
                    "",
                    `$ ${ data.ventas.reduce((acc, item) => acc + item.total, 0) }`
                ],
                // [...],
            ],
        };

        // the magic
        doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(8);
                indexColumn === 0 && doc.addBackground(rectRow, '', 0.15);
            },
        });
        // done!
        doc.end();

        // Open the PDF document after it is written
        writeStream.on('finish', () => {
            const filePath = `./files/corte_${data.fecha}_${fechaArreglo[0]}.${fechaArreglo[1]}.pdf`;

            // Use default application to open the PDF based on OS
            switch (process.platform) {
                case 'darwin':
                    exec(`open ${filePath}`);
                    break;
                case 'win32':
                    exec(`start ${filePath}`);
                    break;
                case 'linux':
                    exec(`xdg-open ${filePath}`);
                    break;
                default:
                    console.log('PDF created at:', filePath);
            }
        });
    })();
}

module.exports = exportarPDF;

