const escpos = require('escpos');
escpos.USB = require('escpos-usb');

class Impresora {

    constructor() {
        const impresoras = this._getImpresoras();

        this.impresora = impresoras[0] ? impresoras[0] : null;
    }

    _getImpresoras() {
        const devices = escpos.USB.findPrinter();
        return devices.map(device => ({
            manufacturer: device.deviceDescriptor.iManufacturer,
            product: device.deviceDescriptor.iProduct,
            serialNumber: device.deviceDescriptor.iSerialNumber,
            vendorId: device.deviceDescriptor.idVendor,
            productId: device.deviceDescriptor.idProduct
        }));
    }

    printTicket(venta) {

        if (this.impresora) {

            console.log(venta);

            const device = new escpos.USB(this.impresora.vendorId, this.impresora.productId);
            const options = { encoding: 'ISO-8859-1' };
            const printerInstance = new escpos.Printer(device, options);

            device.open(() => {
                printerInstance.align('CT');
                printerInstance.style('B');
                printerInstance.text('PANADERIA SAN CAYETANO');
                printerInstance.text('SAN JUAN DEL RÍO, QRO.');
                printerInstance.text('TEL: 2640233');

                printerInstance.text('');
                printerInstance.text('');
                printerInstance.text('');
                printerInstance.text('');

                printerInstance.size(1)
                printerInstance.align('LT');
                printerInstance.text(`Nota: ${venta.idVenta}`)
                printerInstance.text(`Fecha: ${venta.fecha}`)
                printerInstance.text(`Hora: ${venta.hora}`)

                printerInstance.text('');
                printerInstance.text('');

                printerInstance.align('LT')
                printerInstance.size(1, 1);
                printerInstance.text('------------------------');
                printerInstance.size(1);
                printerInstance.table(['Producto', 'Cantidad', 'Precio', 'Total'])

                for (let producto of venta.productos) {
                    printerInstance.table(
                        [
                            `${producto.nombreProducto}`, 
                            `${producto.cantidad}`, 
                            `$${producto.importe}`, 
                            `$${producto.total}`
                        ]
                    )

                }

                printerInstance.size(1, 1);
                printerInstance.text('------------------------');

                printerInstance.text('');
                printerInstance.size(1);
                printerInstance.table(['Total', '', '', `$${venta.totalGeneral}`]);


                printerInstance.size(1, 1);
                printerInstance.text('');
                printerInstance.text('');
                printerInstance.text('');
                printerInstance.align('CT');
                printerInstance.text('¡Gracias por su compra!');
                printerInstance.text('');
                printerInstance.text('');
                printerInstance.text('');

                printerInstance.cut();
                printerInstance.close();
            });

            return JSON.stringify({ success: true, msg: 'La impresión del ticket se realizó con éxito' })
        }

        return JSON.stringify({ success: false, msg: 'La impresora no esta conectada' })
    }
}

module.exports = Impresora