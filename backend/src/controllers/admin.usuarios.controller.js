const prisma = require('../config/prisma');
const logger = require('../config/logger');

const actualizarPermisosMiembro = async (req, res) => {
    try {
        const idAlumno = BigInt(req.params.id);
        const { roles, cargos, departamentos } = req.body;

        const alumno = await prisma.alumnos.findUnique({
            where: { id: idAlumno },
            select: { id: true, usuario_id: true }
        });

        if (!alumno) return res.status(404).json({ mensaje: "Alumno no encontrado." });

        // se guardan los roles, cargos y departamentos al mismo tiempo, si algo falla, no guarda nada
        await prisma.$transaction(async (tx) => {
            if (Array.isArray(roles)) {
                await tx.usuario_rol.deleteMany({ where: { usuario_id: alumno.usuario_id } });
                if (roles.length > 0) {
                    const nuevosRoles = roles.map(r => ({ usuario_id: alumno.usuario_id, rol_id: BigInt(r) }));
                    await tx.usuario_rol.createMany({ data: nuevosRoles });
                }
            }

            if (Array.isArray(cargos)) {
                await tx.alumno_cargo.deleteMany({ where: { alumno_id: idAlumno } });
                if (cargos.length > 0) {
                    const nuevosCargos = cargos.map(c => ({ alumno_id: idAlumno, cargo_id: BigInt(c) }));
                    await tx.alumno_cargo.createMany({ data: nuevosCargos });
                }
            }

            if (Array.isArray(departamentos)) {
                await tx.alumno_departamento.deleteMany({ where: { alumno_id: idAlumno } });
                if (departamentos.length > 0) {
                    const nuevosDeptos = departamentos.map(d => ({ alumno_id: idAlumno, departamento_id: BigInt(d) }));
                    await tx.alumno_departamento.createMany({ data: nuevosDeptos });
                }
            }
        });

        return res.status(200).json({ mensaje: "Permisos y asignaciones actualizados" });

    } catch (error) {
        logger.error(`Error en actualización : ${error.message}`);
        return res.status(500).json({ mensaje: "Error al actualizar los datos del miembro" });
    }
};

const darDeBajaMiembro = async (req, res) => {
    try {
        const idAlumno = BigInt(req.params.id);

        await prisma.$transaction(async (tx) => {
            
            // Desactiva el perfil del alumno
            const alumno = await tx.alumnos.update({
                where: { id: idAlumno },
                data: { activo: false, deleted_at: new Date() }
            });

            await tx.usuarios.update({
                where: { id: alumno.usuario_id },
                data: {
                    bloqueado_hasta: new Date('2099-12-31T23:59:59Z'),
                    deleted_at: new Date()
                }
            });
        });

        return res.status(200).json({ mensaje: "Miembro dado de baja" });

    } catch (error) {
        logger.error(`Error en baja: ${error.message}`);
        return res.status(500).json({ mensaje: "Error al intentar dar de baja." });
    }
};

module.exports = { actualizarPermisosMiembro, darDeBajaMiembro };