const winston = require('winston');
require('winston-daily-rotate-file');

// Configuración para rotar los archivos todos los días (Hostinger friendly)
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/owls-%DATE%.log', // Guarda en la carpeta logs
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Comprime los logs viejos
    maxSize: '20m', // Tamaño máximo del archivo
    maxFiles: '14d' // Borra los logs que tengan más de 14 días
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }), // Captura el stack trace
        winston.format.json() // Formato JSON para leerlo fácil
    ),
    transports: [
        transport
    ]
});

// Si estás en desarrollo (tu computadora local), también lo imprime en la consola
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = logger;