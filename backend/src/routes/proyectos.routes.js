const { Router } = require('express');
const { verificarToken, requerirRoles } = require('../../middlewares/auth.middleware');
const proyectosController = require('../controllers/proyectos.controller');

const router = Router();

router.get('/', verificarToken, requerirRoles([1]), proyectosController.obtenerTodosLosProyectos);
router.get('/:id', verificarToken, requerirRoles([1]), proyectosController.obtenerProyecto);
router.post('/', verificarToken, requerirRoles([1]), proyectosController.crearProyecto);
router.put('/:id', verificarToken, requerirRoles([1]), proyectosController.actualizarProyecto);
router.delete('/:id', verificarToken, requerirRoles([1]), proyectosController.eliminarProyecto);

module.exports = router;