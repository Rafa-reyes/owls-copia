//archivo de ejemplo de como empezar a trabajar
const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/ranking.controller');

// Ranking principal con orden por puntaje total y paginación
router.get('/', rankingController.obtenerRankingGlobal);
router.get('/buscar', rankingController.searchObjetos);
router.get('/fichas', rankingController.fichaAlumnos);


module.exports = router;