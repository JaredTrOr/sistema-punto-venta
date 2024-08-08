const VentasRoutes = require('./routes/ventas');
const CortesRoutes = require('./routes/cortes');
const CategoriasRoutes = require('./routes/categorias');
const SucursalesRoutes = require('./routes/sucursales');
const ProductosRoutes = require('./routes/productos');
const EmpleadosRoutes = require('./routes/empleados');
const connectionMongoDB = require('../connection');

class Routes {

    static inicializarRutas() {

        //Conexión con base de datos local
        connectionMongoDB();

        //Inincialización de rutas
        VentasRoutes.inicializarRutas();
        CortesRoutes.inicializarRutas();
        CategoriasRoutes.inicializarRutas();
        SucursalesRoutes.inicializarRutas();
        ProductosRoutes.inicalizarRutas();
        EmpleadosRoutes.inicializarRutas();
    }
}

module.exports = Routes;
