const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');


//limite de 5 intentos cada 15 minutos
const limite_intentos = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, //cambiar a 5 en produccion
    message: { mensaje: 'Demasiados intentos, intentalo mas tarde' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', limite_intentos, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
