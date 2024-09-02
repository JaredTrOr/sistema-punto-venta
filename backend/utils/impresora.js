const { logger } = require('../logger/logger');
const sucursalGlobal = require('../models/SucursalGlobal');
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

    getImpresoras() {
        let devices = escpos.USB.findPrinter();
        devices = devices.map(device => ({
            manufacturer: device.deviceDescriptor.iManufacturer,
            product: device.deviceDescriptor.iProduct,
            serialNumber: device.deviceDescriptor.iSerialNumber,
            vendorId: device.deviceDescriptor.idVendor,
            productId: device.deviceDescriptor.idProduct
        }));

        return { success: true, impresoras: devices };
    }

    printTicketCorte(corte) {

        if (this.impresora) {

            try {
                const device = new escpos.USB(this.impresora.vendorId, this.impresora.productId);
                const options = { encoding: 'CP437' };
                const printerInstance = new escpos.Printer(device, options);

                //Calcular totales
                const valorInicial = 0;
                const totalGeneral = corte.productos.reduce((acc, element) => acc + element.total, valorInicial);
                const totalCantidad = corte.productos.reduce((acc, element) => acc + element.cantidad, valorInicial);

                device.open(() => {
                    printerInstance.align('CT');
                    printerInstance.style('B');
                    printerInstance.size(1, 1)
                    printerInstance.text('Corte de caja');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.size(1)
                    printerInstance.align('LT');
                    printerInstance.text(`Fecha: ${corte.fechaCorte}`);
                    printerInstance.text(`Hora de corte: ${corte.horaCorte}`);
                    printerInstance.text('');
                    printerInstance.text(`Hora inicio: ${corte.horaInicio}`);
                    printerInstance.text(`Hora finalización: ${corte.horaFin}`);
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.table(['Cantidad', 'Producto', 'Precio', 'Total']);
                    printerInstance.size(1, 1);
                    printerInstance.text('------------------------');
                    printerInstance.size(1);
                    printerInstance.table(['', '', '', '']);
                    for (let producto of corte.productos) {
                        printerInstance.table(
                            [
                                `${producto.cantidad}`,
                                `${producto.nombreProducto}`.substring(0, 11),
                                `$${producto.importe}`,
                                `$${producto.total}`
                            ]
                        );
                    }
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.size(1, 1);
                    printerInstance.text('------------------------');
                    printerInstance.size(1);
                    printerInstance.table(['Unidades vendidas', '', '', 'Total']);
                    printerInstance.table([`${totalCantidad}`, '', '', `$${totalGeneral}`]);
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.cut();
                    printerInstance.close();
                });

                return JSON.stringify({ success: true, message: 'La impresión del ticket se realizó con éxito' });
            } catch (err) {
                logger.error(`${sucursalGlobal.getSucursal}, Backend, printTicketCorte, Ocurrió un error en la impresión ${err}`);
                return JSON.stringify({ success: false, message: `Ocurrió un error en la impresión ${err}` });
            }

        }

        logger.error(`${sucursalGlobal.getSucursal}, Backend, printTicketCorte, La impresora no esta conectada o no esta siendo detectada`);
        return JSON.stringify({ success: false, message: 'La impresora no esta conectada o no esta siendo detectada' })
    }

    printTicket(venta) {

        if (this.impresora) {

            try {
                const device = new escpos.USB(this.impresora.vendorId, this.impresora.productId);
                const options = { encoding: 'CP437' };
                const printerInstance = new escpos.Printer(device, options);

                device.open(() => {
                    printerInstance.align('CT');
                    printerInstance.style('B');
                    printerInstance.size(1, 1)
                    printerInstance.text('PANADERIA SAN CAYETANO');
                    printerInstance.text('SAN JUAN DEL RIO, QRO.');
                    printerInstance.text('TEL: 2640233');

                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');
                    printerInstance.text('');

                    printerInstance.size(1)
                    printerInstance.align('LT');
                    printerInstance.text(`Nota: ${venta.idVenta}`);
                    printerInstance.text(`Fecha: ${venta.fecha}`);
                    printerInstance.text(`Hora: ${venta.hora}`);

                    printerInstance.text('');
                    printerInstance.text('');

                    printerInstance.align('LT')
                    printerInstance.size(1, 1);
                    printerInstance.text('------------------------');
                    printerInstance.size(1);
                    printerInstance.table(['Producto', 'Cantidad', 'Precio', 'Total']);
                    printerInstance.table(['', '', '', '']);

                    for (let producto of venta.productos) {
                        printerInstance.table(
                            [
                                `${producto.nombreProducto}`.substring(0, 11),
                                `${producto.cantidad}`,
                                `$${producto.importe}`,
                                `$${producto.total}`
                            ]
                        );

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

                return JSON.stringify({ success: true, message: 'La impresión del ticket se realizó con éxito' });

            } catch (err) {
                logger.error(`${sucursalGlobal.getSucursal}, Backend, printTicketVenta, Ocurrió un error en la impresión ${err}`);
                return JSON.stringify({ success: false, message: `Ocurrió un error en la impresión ${err}` });
            }
        }

        logger.error(`${sucursalGlobal.getSucursal}, Backend, printTicketVenta, La impresora no esta conectada o no esta siendo detectada`);
        return JSON.stringify({ success: false, message: 'La impresora no esta conectada o no esta siendo detectada' });
    }
}

module.exports = Impresora