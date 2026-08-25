const { Router } = require("express");
const { obtenerEventosVigentes, crearEvento, obtenerTodosLosEventos } = require("../controllers/eventos.controller");
const { requerirRoles } = require("../../middlewares/auth.middleware"); 

const router = Router();

router.get("/vigentes", obtenerEventosVigentes);
router.post("/", requerirRoles([1]), crearEvento);
router.get("/", requerirRoles([1]), obtenerTodosLosEventos);
// router.put("/:id") y router.delete("/:id") aun sin uso

module.exports = router;