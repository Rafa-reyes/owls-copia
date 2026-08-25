const prisma = require('../config/prisma');
const path = require('path');
const fs = require('fs');

// Helper para evitar el error de BigInt en JSON
const serializarBigInt = (valor) => JSON.parse(JSON.stringify(valor, (_, dato) =>
    typeof dato === 'bigint' ? dato.toString() : dato
));

const obtenerCatalogoInsignias = async (req, res) => {
    try {
        const insignias = await prisma.insignias.findMany({ orderBy: { nombre: 'asc' } });
        return res.status(200).json({ data: serializarBigInt(insignias) });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al obtener insignias" });
    }
};

const crearInsigniaMaestra = async (req, res) => {
    try {
        const { nombre, descripcion, url_externa } = req.body;
        if (!nombre) return res.status(400).json({ mensaje: "El nombre es obligatorio" });

        // Validación de Unicidad
        const existe = await prisma.insignias.findFirst({ where: { nombre: nombre.trim() } });
        if (existe) return res.status(400).json({ mensaje: "Ya existe una insignia con ese nombre" });

        let iconoFinal = null;
        if (url_externa && url_externa.startsWith('http')) {
            iconoFinal = url_externa.trim();
        } else if (req.file) {
            iconoFinal = req.file.filename; 
        } else {
            return res.status(400).json({ mensaje: "Debes proporcionar una URL o subir una imagen" });
        }

        const nuevaInsignia = await prisma.insignias.create({
            data: { nombre: nombre.trim(), descripcion: descripcion ? descripcion.trim() : null, icono: iconoFinal }
        });
        return res.status(201).json({ mensaje: "Insignia creada", data: serializarBigInt(nuevaInsignia) });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error interno" });
    }
};

const editarInsigniaMaestra = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        const { nombre, descripcion, url_externa } = req.body;
        
        const insignia = await prisma.insignias.findUnique({ where: { id } });
        if (!insignia) return res.status(404).json({ mensaje: "Insignia no encontrada" });

        // Verificar unicidad si el nombre cambio
        if (nombre && nombre.trim() !== insignia.nombre) {
            const existe = await prisma.insignias.findFirst({ where: { nombre: nombre.trim() } });
            if (existe) return res.status(400).json({ mensaje: "El nombre ya está en uso" });
        }

        let iconoFinal = insignia.icono; // Conservar el anterior por defecto
        if (url_externa && url_externa.startsWith('http')) {
            iconoFinal = url_externa.trim();
        } else if (req.file) {
            iconoFinal = req.file.filename;
        }

        await prisma.insignias.update({
            where: { id },
            data: {
                nombre: nombre ? nombre.trim() : insignia.nombre,
                descripcion: descripcion !== undefined ? descripcion.trim() : insignia.descripcion,
                icono: iconoFinal
            }
        });
        return res.status(200).json({ mensaje: "Insignia actualizada" });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error interno" });
    }
};

const eliminarInsigniaMaestra = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        await prisma.insignias.delete({ where: { id } });
        return res.status(200).json({ mensaje: "Insignia eliminada completamente" });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ mensaje: "Insignia no encontrada" });
        return res.status(500).json({ mensaje: "Error al eliminar" });
    }
};

const asignarInsigniaAlumno = async (req, res) => {
    try {
        const { alumno_id, insignia_id } = req.body;
        if (!alumno_id || !insignia_id) return res.status(400).json({ mensaje: "Faltan datos" });

        await prisma.alumno_insignia.upsert({
            where: { alumno_id_insignia_id: { alumno_id: BigInt(alumno_id), insignia_id: BigInt(insignia_id) } },
            update: {},
            create: { alumno_id: BigInt(alumno_id), insignia_id: BigInt(insignia_id) }
        });
        return res.status(200).json({ mensaje: "Insignia asignada correctamente" });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al asignar insignia" });
    }
};
const obtenerFotoInsignia = (req, res) => {
    try {
        const nombreArchivo = path.basename(req.params.nombreArchivo);

        const rutaImagen = path.resolve(__dirname, '../../uploads/insignias', nombreArchivo);

        if (fs.existsSync(rutaImagen)) {
            return res.sendFile(rutaImagen);
        } else {
            return res.status(404).json({ mensaje: "Imagen no encontrada" });
        }
    } catch (error) {
        console.error("Error de Path al servir imagen:", error);
        return res.status(500).json({ mensaje: "Error al cargar la imagen" });
    }
};

module.exports = {
    obtenerCatalogoInsignias,
    crearInsigniaMaestra,
    editarInsigniaMaestra,
    eliminarInsigniaMaestra,
    asignarInsigniaAlumno,
    obtenerFotoInsignia
};
