const prisma = require('../config/prisma');
const isProd = process.env.NODE_ENV === 'production';

const getDirectory= async (req, res) => {
    try {
        const alumnos = await prisma.alumnos.findMany({
            where: { activo: true },
            orderBy: { nombre: "asc" },   // ← se saca de select y va aquí
            select: {
                id: true,
                matricula: true,
                nombre: true,
                ap_paterno: true,
                ap_materno: true,
                alumno_departamento: {
                    select: { departamentos: { select: { nombre: true } } }
                },
                alumno_cargo: {
                    select: { cargos: { select: { nombre: true } } }
                },
            }
        });
        const directoryFormat = alumnos.map(alumno => {
            const paterno = alumno.ap_paterno || '';
            const materno = alumno.ap_materno || '';
            
            const nombreCompleto = `${alumno.nombre} ${paterno} ${materno}`.trim().replace(/\s+/g, ' ');

            return {
                id: alumno.id.toString(),
                matricula: alumno.matricula,
                nombre: alumno.nombre,
                ap_paterno: paterno,
                ap_materno: materno,
                nombreCompleto: nombreCompleto,
                departamentos: alumno.alumno_departamento.map(ad => ad.departamentos.nombre),
                cargos: alumno.alumno_cargo.map(ac => ac.cargos.nombre),
            };
        });
        res.status(200).json({ success: true, data: directoryFormat });
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.status(500).json({ success: false, message: "Error del servidor." });
    }
}

module.exports= {getDirectory};