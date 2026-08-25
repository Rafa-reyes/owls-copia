const express = require('express');
const router = express.Router();

const { actualizarPerfil } = require('../controllers/put.controller');
const { verificarToken } = require('../../middlewares/auth.middleware');

router.put('/me', verificarToken, actualizarPerfil);

module.exports = router;

