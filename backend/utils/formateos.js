function formatearFecha(fecha) {
    return fecha.replace(/\//g, "-");
}

function pad(n) {
    return n.toString().padStart(2, '0');
}

function getFormattedDate(date) {
    const dia = pad(date.getDate());
    const mes = pad(date.getMonth() + 1);
    const anio = date.getFullYear();

    return `${dia}/${mes}/${anio}`;
}

function getFormattedHour(date) {

    const horas = pad(date.getHours());
    const minutos = pad(date.getMinutes());

    return `${horas}:${minutos}`;
}

module.exports = {
    formatearFecha,
    getFormattedDate,
    getFormattedHour
}