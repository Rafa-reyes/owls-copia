const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnos.controller');
const { requerirRoles } = require('../../middlewares/auth.middleware');

router.get('/', alumnosController.obtenerAlumnos);
router.get('/perfil', requerirRoles([1]), alumnosController.obtener_perfil);
router.get("/miembros", alumnosController.obtenerMiembros);
//router.put("/perfil", middleware.modificar_datos);

module.exports = router;