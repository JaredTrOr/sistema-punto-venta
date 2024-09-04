require('winston-mongodb')
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;

const loggerFilesPath = path.join(__dirname, '../../logs');

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const infoFilter = format((info, opts) => {
    return info.level === 'info' ? info : false;
});

const errorFilter = format((info, opts) => {
    return info.level === 'error' ? info : false;
});

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [

        //Transporte por consola
        new transports.Console({
            format: combine(
                colorize(), 
                logFormat
            )
        }),

        // Transporte para mensajes de info
        new transports.File({
            filename: `${loggerFilesPath}/info.log`,
            level: 'info',
            format: combine(
                infoFilter(),
                timestamp(),
                logFormat
            )
        }),

        // Transporte para mensajes de error
        new transports.File({
            filename: `${loggerFilesPath}/errors.log`,
            level: 'error',
            format: combine(
                errorFilter(),
                timestamp(),
                logFormat
            )
        }),

        new transports.MongoDB({
            options: { useUnifiedTopology: true },
            db: process.env.MONGO_LOG_URI,
            level: 'error',
            collection: 'logs',
            format: combine(
                errorFilter(),
                timestamp(),
                json()
            ),
        })
        
    ]
});

function formatoMensajeError (sucursal, tipo, funcion, mensaje) {
    return `${sucursal}, ${tipo}, ${funcion}, ${mensaje}`
}

module.exports = {logger, formatoMensajeError};
