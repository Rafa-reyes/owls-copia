const prisma = require('../config/prisma');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

// Definimos el directorio base una sola vez para usarlo en ambas funciones
const UPLOADS_DIR = path.join(__dirname, '../../uploads/perfiles');

const subirFoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ mensaje: "No se recibió ninguna imagen" });
        }

        const idUsuario = BigInt(req.user.id);

        const alumno = await prisma.alumnos.findFirst({
            where: { usuario_id: idUsuario },
            select: { id: true, foto_perfil: true }
        });

        if (!alumno) {
            // Si el alumno no existe, se borra la foto que multer acaba de subir
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ mensaje: "Alumno no encontrado" });
        }

        // Si ya se tenía foto, se borra la anterior física para no acumular archivos huérfanos
        if (alumno.foto_perfil) {
            const oldPath = path.join(UPLOADS_DIR, alumno.foto_perfil);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Actualizamos el registro en la base de datos con el nuevo nombre
        await prisma.alumnos.update({
            where: { id: alumno.id },
            data: { foto_perfil: req.file.filename }
        });

        // Retornamos el éxito incluyendo el mimeType verificado por el middleware
        return res.status(200).json({
            mensaje: "Foto actualizada correctamente",
            foto_perfil: req.file.filename,
            mimeTypeVerificado: req.file.verifiedMimeType
        });

    } catch (error) {
        logger.error(`Error al subir foto: ${error.message}`);
        return res.status(500).json({ mensaje: "Error del servidor al subir la foto" });
    }
};

const obtenerFoto = async (req, res) => {
    try {
        const { nombreArchivo } = req.params;

        // Limpieza de saltos de directorio preventivos
        const safePath = path.normalize(nombreArchivo).replace(/^(\.\.(\/|\\|$))+/, '');
        const rutaAbsoluta = path.join(UPLOADS_DIR, safePath);

        // Refuerzo: confirma que la ruta resuelta sigue dentro de UPLOADS_DIR
        if (!rutaAbsoluta.startsWith(UPLOADS_DIR)) {
            return res.status(400).json({ mensaje: "Ruta de archivo inválida" });
        }

        if (fs.existsSync(rutaAbsoluta)) {
            return res.sendFile(rutaAbsoluta);
        } else {
            return res.status(404).json({ mensaje: "Imagen no encontrada" });
        }
    } catch (error) {
        logger.error(`Error al recuperar imagen: ${error.message}`);
        return res.status(500).json({ mensaje: "Error al recuperar imagen" });
    }
};

module.exports = { subirFoto, obtenerFoto };