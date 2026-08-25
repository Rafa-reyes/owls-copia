// backend/middlewares/rateLimit.middleware.js
const rateLimit = require('express-rate-limit');

// Configuración estricta para rutas críticas (ej. PUT, POST, DELETE)
const strictUpdateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // Ventana de tiempo: 1 minuto (en milisegundos)
    max: 100, // limite maximo, cambiar a 5 en produccion
    message: {
        error: "Demasiadas peticiones de actualización detectadas. Por favor, intenta de nuevo en 1 minuto."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    strictUpdateLimiter
};