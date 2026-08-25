const prisma = require('../config/prisma');
const { encode } = require('html-entities');

const serializarBigInt = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => typeof v === 'bigint' ? v.toString() : v));
const sanitizar = (str) => (typeof str === 'string' && str.trim() ? encode(str.trim()) : null);

const obtenerTodosLosCursos = async (req, res) => {
    try {
        const cursos = await prisma.cursos.findMany({ orderBy: { fecha_inicio: 'desc' } });
        return res.status(200).json({ data: serializarBigInt(cursos) });
    } catch (error) { return res.status(500).json({ mensaje: "Error al cargar." }); }
};

const crearCurso = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, fecha_terminacion } = req.body;
        if (!nombre) return res.status(400).json({ mensaje: "Falta el nombre" });

        const nuevoCurso = await prisma.$transaction(async (tx) => {
            const actividad = await tx.actividades.create({ data: { tipo_actividad: 'Curso' } });
            return await tx.cursos.create({
                data: {
                    id: actividad.id,
                    nombre: sanitizar(nombre),
                    descripcion: sanitizar(descripcion),
                    fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
                    fecha_terminacion: fecha_terminacion ? new Date(fecha_terminacion) : null
                }
            });
        });
        return res.status(201).json({ mensaje: "Creado", data: serializarBigInt(nuevoCurso) });
    } catch (error) { return res.status(500).json({ mensaje: "Error al crear." }); }
};

const eliminarCurso = async (req, res) => {
    try {
        await prisma.actividades.delete({ where: { id: BigInt(req.params.id) } });
        return res.status(200).json({ mensaje: "Eliminado" });
    } catch(error) { return res.status(500).json({ mensaje: "Error." }); }
};

module.exports = { obtenerTodosLosCursos, crearCurso, eliminarCurso };