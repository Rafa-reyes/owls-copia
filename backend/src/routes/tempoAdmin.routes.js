// src/routes/tempoAdmin.routes.js
const express = require('express');
const router = express.Router();
const tempoAdminController = require('../controllers/tempoAdmin.controller');

//rateLimit zone
// backend/routes/tempoAdmin.routes.js
const { requerirRoles } = require('../middlewares/auth.middleware');
const { strictUpdateLimiter } = require('../middlewares/rateLimit.middleware');

router.post('/crear', requerirRoles([1]), tempoAdminController.crearRegistro);
router.get('/ver', requerirRoles([1]), tempoAdminController.obtenerRegistros);

// Se le aplica el Rate Limit estricto
router.put('/modificar/:id', strictUpdateLimiter, requerirRoles([1]), tempoAdminController.actualizarRegistro);
router.delete('/eliminar/:id', requerirRoles([1]), tempoAdminController.eliminarRegistro);

module.exports = router;