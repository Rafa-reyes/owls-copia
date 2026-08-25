const express = require('express');
const router = express.Router();
const patrocinio = require('../controllers/patrocinios.controller');
const { verificarToken, requerirRoles } = require('../../middlewares/auth.middleware');

// Rutas Públicas
router.get('/', patrocinio.obtenerTodosPatrocinadores);
router.get('/:id', patrocinio.obtenerPatrocinadorPorId);
router.get('/tipo/:tipo_entidad_id', patrocinio.obtenerPatrocinadoresPorTipo);

// Rutas PROTEGIDA
router.post('/', verificarToken, requerirRoles([1]), patrocinio.crearPatrocinador);
router.put('/:id', verificarToken, requerirRoles([1]), patrocinio.actualizarPatrocinador);
router.delete('/:id', verificarToken, requerirRoles([1]), patrocinio.eliminarPatrocinador);

module.exports = router;