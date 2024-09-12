class SucursalGlobal {

    isDev = false;

    constructor() { }

    get isDev() {
        return this.isDev;
    }
    
    get getSucursal() {
        return this.sucursal;
    }

    setSucursal(sucursal) {
        this.sucursal = sucursal;
    }
}

const sucursalGlobal = new SucursalGlobal()

module.exports = sucursalGlobal;
