const VentasRoutes = require('./routes/ventas');
const CortesRoutes = require('./routes/cortes');
const CategoriasRoutes = require('./routes/categorias');
const SucursalesRoutes = require('./routes/sucursales');
const ProductosRoutes = require('./routes/productos');
const EmpleadosRoutes = require('./routes/empleados');
const UtilsRoutes = require('./routes/utils');
const LoggerRoutes = require('./routes/logger');
const connectionMongoDB = require('../connection');
const sucursalGlobal = require('../models/SucursalGlobal');
const { getSucursalSeleccionada } = require('../controllers/sucursales')

class Routes {

    static async inicializarRutas() {

        //Inicialización de provider global
        sucursalGlobal.setSucursal(await getSucursalSeleccionada());

        //Conexión con base de datos local
        connectionMongoDB();

        //Inincialización de rutas
        VentasRoutes.inicializarRutas();
        CortesRoutes.inicializarRutas();
        CategoriasRoutes.inicializarRutas();
        SucursalesRoutes.inicializarRutas();
        ProductosRoutes.inicalizarRutas();
        EmpleadosRoutes.inicializarRutas();
        UtilsRoutes.inicalizarRutas();
        LoggerRoutes.inicializarRutas();
    }
}

module.exports = Routes;
