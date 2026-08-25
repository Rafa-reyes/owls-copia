const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');

// Rutas del Dashboard - Protegidas (requieren autenticación)
// El acceso puede extenderse a diferentes roles según necesidad

router.get('/metricas-principales', verificarToken, dashboardController.getMetricasPrincipales);
router.get('/distribucion-carrera', verificarToken, dashboardController.getDistribucionCarrera);
router.get('/estadisticas-eventos', verificarToken, dashboardController.getEstadisticasEventos);
router.get('/estadisticas-proyectos', verificarToken, dashboardController.getEstadisticasProyectos);
router.get('/top-alumnos', verificarToken, dashboardController.getTopAlumnos);
router.get('/estadisticas-cursos', verificarToken, dashboardController.getEstadisticasCursos);
router.get('/estadisticas-habilidades', verificarToken, dashboardController.getEstadisticasHabilidades);
router.get('/panel-completo', verificarToken, dashboardController.getPanelCompleto);

module.exports = router;
