const express = require('express');
const router = express.Router();
const { verificarToken, requerirRoles } = require('../../middlewares/auth.middleware');

const { marcarDestacado } = require('../controllers/novedad.controller');

// Endpoint para someter una novedad a validación de cuota
router.patch('/novedades/:id/destacado', verificarToken, requerirRoles([1]), marcarDestacado);

module.exports = router;