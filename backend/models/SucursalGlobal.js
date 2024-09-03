class SucursalGlobal {
    constructor() { }

    get getSucursal() {
        return this.sucursal;
    }

    setSucursal(sucursal) {
        this.sucursal = sucursal;
    }
}

const sucursalGlobal = new SucursalGlobal()

module.exports = sucursalGlobal;
