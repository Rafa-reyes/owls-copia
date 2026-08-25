const express = require('express');
const router = express.Router();

const {getDirectory}= require("../controllers/admin.controller");
const {requerirRoles}= require("../../middlewares/auth.middleware");
const { actualizarPermisosMiembro, darDeBajaMiembro } = require('../controllers/admin.usuarios.controller');

router.get("/directorio", requerirRoles([1]),getDirectory);//endpoint
router.put('/miembros/:id', requerirRoles([1]), actualizarPermisosMiembro);
router.delete('/miembros/:id', requerirRoles([1]), darDeBajaMiembro);
module.exports= router;