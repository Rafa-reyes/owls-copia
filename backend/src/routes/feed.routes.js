const { Router } = require('express');
const feedController = require('../controllers/feed.controller');

const router = Router();
router.get('/', feedController.obtenerFeed);

module.exports = router;