const { Router } = require("express");
const { obtenerTodosLosCursos, crearCurso, eliminarCurso } = require("../controllers/cursos.controller");
const { verificarToken, requerirRoles } = require("../../middlewares/auth.middleware");

const router = Router();
router.get("/", verificarToken, requerirRoles([1]), obtenerTodosLosCursos);
router.post("/", verificarToken, requerirRoles([1]), crearCurso);
router.delete("/:id", verificarToken, requerirRoles([1]), eliminarCurso);

module.exports = router;