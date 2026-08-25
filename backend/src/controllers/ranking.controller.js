const prisma = require('../config/prisma');
const logger = require('../config/logger');

// Ruta de prueba
const obtenerAlumnos = async (req, res) => {
    try {
        res.status(200).json({ mensaje: "Lista de alumnos desde el controlador del ranking" });
    } catch (error) {
        logger.error(`Error en obtenerAlumnos (ranking): ${error.message}`);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// Obtener ficha de alumnos
const fichaAlumnos = async (req, res) => {
    try {
        const alumnos = await prisma.alumnos.findMany({
            select: {
                matricula: true,
                nombre: true,
                alumno_habilidades: {
                    select: {
                        niveles_habilidad: {
                            select: {
                                nombre: true
                            }
                        }
                    }
                }
            }
        });

        const dataFormateada = alumnos.map(alumno => {
            let nivel = "SIN ASIGNAR";

            if (alumno.alumno_habilidades && alumno.alumno_habilidades.length > 0) {
                const nivelData = alumno.alumno_habilidades[0].niveles_habilidad;
                if (nivelData) {
                    nivel = nivelData.nombre;
                }
            }
            
            return {
                matricula: alumno.matricula ? alumno.matricula.toString() : null,
                nombre: alumno.nombre,
                nivel_actual: nivel
            };
        });
        res.status(200).json(dataFormateada);

    } catch (error) {
        logger.error(`Error al obtener la lista de fichas: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor al cargar el ranking" });
    }
};

// Busqueda en el ranking
const searchObjetos = async (req, res) => {
    const { q } = req.query;

    try {
        const resultados = await prisma.alumnos.findMany({
            where: q ? {
                OR: [
                    { nombre: { contains: q, mode: 'insensitive' } }
                    // NOTA: Se removió la búsqueda parcial en 'matricula' porque si es Int/BigInt, 
                    // usar 'contains' crashea Prisma.
                ]
            } : {} // Si "q" está vacío, trae toda la tabla
        });

        // Mapeo de seguridad por si el ID o matrícula son BigInt
        const resultadosSeguros = resultados.map(reg => ({
            ...reg,
            id: reg.id ? reg.id.toString() : undefined,
            matricula: reg.matricula ? reg.matricula.toString() : undefined
        }));

        res.status(200).json(resultadosSeguros);
    } catch (error) {
        logger.error(`Error en el controlador de búsqueda (ranking): ${error.message}`);
        res.status(500).json({ error: "Error al filtrar la base de datos" });
    }
};
const obtenerRankingGlobal = async (req, res) => {
  try {
    const pagina = Math.max(1, Number(req.query.pagina) || 1);
    const limite = Math.min(50, Math.max(1, Number(req.query.limite) || 10));
    const offset = (pagina - 1) * limite;
    /* si una evaluacion de curso llega a tener mas de una evaluación de actitud, sql duplicara la fila del curso,
     hacer la sentencia con subconsultas correlacionadas, de preferencia con coalesce*/
    const rankingRaw = await prisma.$queryRaw`
    SELECT
        a.id,
        a.nombre,
        a.ap_paterno,
        a.foto_perfil,
        COALESCE((
        SELECT SUM(ec.total_puntos)
        FROM evaluaciones_cursos ec
        WHERE ec.alumno_id = a.id
        ), 0)
        +
        COALESCE((
        SELECT SUM(ea.total_puntos_actitud)
        FROM evaluaciones_actitud ea
        INNER JOIN evaluaciones_cursos ec2 ON ec2.id = ea.evaluacion_curso_id
        WHERE ec2.alumno_id = a.id
        ), 0) AS puntos_totales
    FROM alumnos a
    WHERE a.activo = true
    ORDER BY puntos_totales DESC
    LIMIT ${limite} OFFSET ${offset}
    `;//hecho

    const totalUsuarios = await prisma.alumnos.count({
      where: { activo: true }
    });

    const data = rankingRaw.map((user, index) => ({
      posicion: offset + index + 1,
      id: user.id.toString ? user.id.toString() : String(user.id),
      nombre: user.nombre,
      ap_paterno: user.ap_paterno,
      foto_perfil: user.foto_perfil,
      puntos: Number(user.puntos_totales || 0)
    }));

    return res.status(200).json({
      data,
      paginacion: {
        paginaActual: pagina,
        limite,
        totalUsuarios,
        totalPaginas: Math.ceil(totalUsuarios / limite)
      }
    });
  } catch (error) {
    logger.error(`Error en ranking global: ${error.message}`);
    return res.status(500).json({ error: "Error al obtener el ranking." });
  }
};

module.exports = {
  obtenerAlumnos,
  fichaAlumnos,
  searchObjetos,
  obtenerRankingGlobal
};