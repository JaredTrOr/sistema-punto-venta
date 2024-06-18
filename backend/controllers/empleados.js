const Empleado = require('../models/Empleado');

async function iniciarSesion(event, data) {
    try {
        const empleado = await Empleado.findOne({
            usuario: data.usuario,
            password: data.password
        })

        if (empleado) {
            const ruta = empleado.usuario === 'admin' ? '/admin-ventas-filtros' : '/ventas';
            event.reply('iniciar-sesion', JSON.stringify({ success: true, message: 'Inicio de sesión exitoso', empleado, ruta }))
        }
        else {
            event.reply('iniciar-sesion', JSON.stringify({ success: false, message: 'Usuario o contraseña incorrectos' }))
        }
    } catch(err) {
        console.log({ success: false, message: err });
    }
}

module.exports = {
    iniciarSesion
}