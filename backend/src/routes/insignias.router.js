const { Router } = require("express");
const { obtenerCatalogoInsignias, crearInsigniaMaestra, editarInsigniaMaestra, eliminarInsigniaMaestra, asignarInsigniaAlumno, obtenerFotoInsignia } = require("../controllers/insignias.controller");
const { requerirRoles } = require("../../middlewares/auth.middleware");
const { uploadInsignia } = require("../../middlewares/upload.middleware");
const verifyMagicNumber = require("../../middlewares/VMN.middleware");

const router = Router();

const checkMagicNumberOpcional = (req, res, next) => {
    // Si NO hay archivo en la petición  nos saltamos el VMN y pasamos directo al controlador.
    if (!req.file) {
        return next();
    }
    return verifyMagicNumber(req, res, next);
};

router.get("/catalogo", requerirRoles([1]), obtenerCatalogoInsignias);

router.post("/maestra", requerirRoles([1]), uploadInsignia.single('icono_local'), checkMagicNumberOpcional, crearInsigniaMaestra);
router.put("/maestra/:id", requerirRoles([1]), uploadInsignia.single('icono_local'), checkMagicNumberOpcional, editarInsigniaMaestra);
router.delete("/maestra/:id", requerirRoles([1]), eliminarInsigniaMaestra);
router.post("/otorgar", requerirRoles([1]), asignarInsigniaAlumno);
router.get("/foto/:nombreArchivo", obtenerFotoInsignia);

module.exports = router;