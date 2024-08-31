const { getSucursalSeleccionada } = require('../controllers/sucursales');

class SucursalGlobal {
    constructor(sucursal) {
        this.sucursal = sucursal;
    }

    get getSucursal() {
        return this.sucursal;
    }

    setSucursal(sucursal) {
        this.sucursal = sucursal;
    }
}

async function createSucursalGlobal() {
    const sucursalSeleccionada = await getSucursalSeleccionada();
    return new SucursalGlobal(sucursalSeleccionada);
}

module.exports = createSucursalGlobal();
