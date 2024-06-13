function formatearFecha(fecha) {
    return fecha.replace(/\//g, "-");
}

module.exports = {
    formatearFecha
}