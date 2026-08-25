const express = require('express');
const router = express.Router();

const { actualizarPerfil, obtenerRankingUsuario, obtenerMiPerfil, obtenerEstadisticas, cambiarPassword } = require('../controllers/put.controller');
const { requerirRoles } = require('../../middlewares/auth.middleware');
const { uploadPerfil } = require('../../middlewares/upload.middleware');
const verifyMagicNumber = require('../../middlewares/VMN.middleware');

const { subirFoto, obtenerFoto } = require('../controllers/foto.controller');

router.patch('/me', requerirRoles([1]), actualizarPerfil);
router.get('/me/ranking', requerirRoles([1]), obtenerRankingUsuario);
router.get('/me', requerirRoles([1]), obtenerMiPerfil);
router.get('/me/stats', requerirRoles([1, 2]), obtenerEstadisticas);
router.patch('/password', requerirRoles([1]), cambiarPassword);

router.patch('/foto', requerirRoles([1]), uploadPerfil.single('foto'), verifyMagicNumber, subirFoto);

// Ruta publica para ver la foto
router.get('/foto/:nombreArchivo', obtenerFoto);

module.exports = router;