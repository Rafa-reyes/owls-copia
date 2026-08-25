const prisma = require('../config/prisma');
const logger = require('../config/logger');
const obtenerAlumnos = async (req, res) => {
    try {
        // Usar Prisma para buscar en Postgres
        const alumnos = await prisma.alumno.findMany();
        return res.status(200).json(alumnos);
    } catch (error) {
        logger.error(`Error en obtenerAlumnos: ${error.message}`);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};

const obtener_perfil= async(req, res)=>{
    try {
        const usuarioId= req.usuarioId;
        const perfil = await prisma.alumnos.findFirst({ //de la sesion que se pida, solo trae los siguiente datos
            where: { usuario_id: BigInt(usuarioId) },
            select: {
                id:true,
                nombre: true,
                ap_paterno: true,
                ap_materno: true,
                matricula: true,
                foto_perfil: true,
                usuarios: {
                    select: {
                        correo: true
                    }
                }
            }
    });

    if(!perfil){
        logger.warn("Intento de acceso a perfil inexistente");
            return res.status(404).json({ message: "No se encontró el perfil" }); //no se ecnuentra el usuario con esa sesion
    }

    const datos_correctos= {
        ...perfil, id: perfil.id.toString() //como el id es un BigInt, se convierte a string para que no haya fallas
    };

    res.status(200).json(datos_correctos); //se mandan los datos
    } catch (error) {
        logger.error(`Error crítico en obtener_perfil: ${error.message}`, { stack: error.stack });
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
}


const obtenerMiembros = async (req, res) => {
    try {
        const miembrosRaw = await prisma.alumnos.findMany({
            where: { activo: true },
            select: {
                id: true,
                nombre: true,
                ap_paterno: true,
                foto_perfil: true,
                usuarios: {
                    select: {
                        usuario_rol: {
                            select: { roles_usuario: { select: { nombre: true } } }
                        }
                    }
                },
                alumno_departamento: {
                    select: { departamentos: { select: { nombre: true } } }
                }
            }
        });

        const miembrosFormateados = miembrosRaw.map(alumno => {
            // Extraer TODOS los roles del usuario
            const rolesArray = alumno.usuarios?.usuario_rol?.map(ur => ur.roles_usuario?.nombre) || [];
            
            // Definir qué título mostrar en su tarjeta
            let rolParaMostrar = 'Miembro';
            if (rolesArray.includes('Administrador') || rolesArray.includes('Coordinador')) {
                rolParaMostrar = 'Coordinador';
            } else if (rolesArray.length > 0) {
                rolParaMostrar = rolesArray[0];
            }
            const departamentosDB = alumno.alumno_departamento?.length > 0
                ? alumno.alumno_departamento.map(ad => ad.departamentos?.nombre)
                : ['Desarrollo Web'];

            return {
                id: typeof alumno.id === 'bigint' ? alumno.id.toString() : alumno.id,
                nombre: alumno.nombre,
                ap_paterno: alumno.ap_paterno,
                rol_especifico: rolParaMostrar,
                departamentos: departamentosDB,
                foto: alumno.foto_perfil || null
            };
        });

        return res.status(200).json({ success: true, datos: miembrosFormateados });
    } catch (error) {
        console.error(`Error en obtenerMiembros: ${error.message}`);
        return res.status(500).json({ error: "Error interno al obtener la lista de miembros" });
    }
};

module.exports = {
    obtenerAlumnos, obtener_perfil, obtenerMiembros
};

