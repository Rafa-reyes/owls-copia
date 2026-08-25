const prisma = require('../config/prisma');
const logger = require('../config/logger');

/**
 * Servicio de Dashboard
 * Utiliza funciones de agregación nativas del ORM para procesar métricas
 * directamente en el motor de la base de datos sin cargar colecciones en memoria
 */

// Obtener métricas principales del dashboard
const obtenerMetricasPrincipales = async () => {
    try {
        // Usar Promise.all para ejecutar las agregaciones en paralelo
        const [
            totalAlumnos,
            totalCursos,
            totalProyectos,
            totalPatrocinadores,
            alumnoCursoStats,
            proyectosStats
        ] = await Promise.all([
            // Count de alumnos activos
            prisma.alumnos.count({
                where: { activo: true }
            }),

            // Count de cursos
            prisma.cursos.count(),

            // Count de proyectos
            prisma.proyectos.count(),

            // Count de patrocinadores
            prisma.patrocinadores.count(),

            // Stats de alumnos en cursos
            prisma.alumno_curso.aggregate({
                _count: true,
                _avg: {
                    calificacion: true
                },
                _max: {
                    calificacion: true
                },
                _min: {
                    calificacion: true
                }
            }),

            // Stats de proyectos
            prisma.proyectos.aggregate({
                _count: true
            })
        ]);

        const metricas = {
            totalAlumnos,
            totalCursos,
            totalProyectos,
            totalPatrocinadores,
            estadisticasAlumnoCurso: {
                totalEnrolados: alumnoCursoStats._count || 0,
                calificacionPromedio: alumnoCursoStats._avg?.calificacion || 0,
                calificacionMaxima: alumnoCursoStats._max?.calificacion || 0,
                calificacionMinima: alumnoCursoStats._min?.calificacion || 0
            }
        };

        logger.info('Métricas principales del dashboard generadas exitosamente');
        return metricas;
    } catch (error) {
        logger.error(`Error en obtenerMetricasPrincipales: ${error.message}`);
        throw error;
    }
};

// Obtener distribución de alumnos por carrera
const obtenerDistribucionPorCarrera = async () => {
    try {
        const distribucion = await prisma.alumnos.groupBy({
            by: ['carrera_id'],
            _count: true,
            orderBy: {
                _count: {
                    carrera_id: 'desc'
                }
            }
        });

        // Obtener nombres de carreras para hacer más legible
        const distribucionConNombres = await Promise.all(
            distribucion.map(async (item) => {
                if (!item.carrera_id) {
                    return {
                        carrera_id: null,
                        carrera_nombre: 'Sin carrera asignada',
                        cantidad: item._count
                    };
                }

                const carrera = await prisma.carreras.findUnique({
                    where: { id: item.carrera_id },
                    select: { nombre: true }
                });

                return {
                    carrera_id: item.carrera_id,
                    carrera_nombre: carrera?.nombre || 'Desconocida',
                    cantidad: item._count
                };
            })
        );

        logger.info('Distribución por carrera generada exitosamente');
        return distribucionConNombres;
    } catch (error) {
        logger.error(`Error en obtenerDistribucionPorCarrera: ${error.message}`);
        throw error;
    }
};

// Obtener estadísticas de eventos
const obtenerEstadisticasEventos = async () => {
    try {
        const [
            totalEventos,
            alumnosPorEvento,
            puntosPromedio
        ] = await Promise.all([
            prisma.eventos_internos.count(),

            prisma.alumno_evento.aggregate({
                _count: true
            }),

            prisma.alumno_evento.aggregate({
                _avg: {
                    puntos_ganados: true
                },
                _sum: {
                    puntos_ganados: true
                }
            })
        ]);

        const estadisticas = {
            totalEventos,
            totalParticipaciones: alumnosPorEvento._count || 0,
            puntosPromedioGanados: puntosPromedio._avg?.puntos_ganados || 0,
            puntosTotalesDistribuidos: puntosPromedio._sum?.puntos_ganados || 0
        };

        logger.info('Estadísticas de eventos generadas exitosamente');
        return estadisticas;
    } catch (error) {
        logger.error(`Error en obtenerEstadisticasEventos: ${error.message}`);
        throw error;
    }
};

// Obtener estadísticas de proyectos y patrocinio
const obtenerEstadisticasProyectos = async () => {
    try {
        const [
            totalProyectos,
            alumnosPorProyecto,
            montoTotalPatrocinio,
            proyectosConPatrocinio
        ] = await Promise.all([
            prisma.proyectos.count(),

            prisma.alumno_proyecto.aggregate({
                _count: true
            }),

            prisma.proyecto_patrocinador.aggregate({
                _sum: {
                    monto_estimado: true
                }
            }),

            prisma.proyecto_patrocinador.count()
        ]);

        const estadisticas = {
            totalProyectos,
            totalAlumnosEnProyectos: alumnosPorProyecto._count || 0,
            montoTotalPatrocinioEstimado: montoTotalPatrocinio._sum?.monto_estimado || 0,
            proyectosConPatrocinio
        };

        logger.info('Estadísticas de proyectos generadas exitosamente');
        return estadisticas;
    } catch (error) {
        logger.error(`Error en obtenerEstadisticasProyectos: ${error.message}`);
        throw error;
    }
};

// Obtener top 10 alumnos por puntaje REAL (Evaluaciones + Eventos + Extra)
const obtenerTopAlumnosPuntos = async (limite = 10) => {
    try {
        const topAlumnos = await prisma.$queryRaw`
            SELECT
                a.id,
                a.nombre,
                a.ap_paterno,
                a.ap_materno,
                a.matricula,
                (
                    COALESCE(a.puntos_extra, 0) +
                    COALESCE(SUM(ae.puntos_ganados), 0) +
                    COALESCE((SELECT SUM(total_puntos) FROM evaluaciones_cursos WHERE alumno_id = a.id), 0)
                ) as puntos_totales
            FROM alumnos a
            LEFT JOIN alumno_evento ae ON a.id = ae.alumno_id
            WHERE a.activo = true
            GROUP BY a.id, a.nombre, a.ap_paterno, a.ap_materno, a.matricula, a.puntos_extra
            ORDER BY puntos_totales DESC
            LIMIT ${limite};
        `;

        logger.info(`Top ${limite} alumnos por puntos obtenidos reales`);
        
        // Serializar los BigInts que devuelve $queryRaw
        return JSON.parse(JSON.stringify(topAlumnos, (k, v) => typeof v === 'bigint' ? Number(v) : v));
    } catch (error) {
        logger.error(`Error en obtenerTopAlumnosPuntos: ${error.message}`);
        throw error;
    }
};

// Obtener estadísticas de cursos
const obtenerEstadisticasCursos = async () => {
    try {
        const [
            totalCursos,
            alumnosEnCursos,
            calificacionPromedioCursos
        ] = await Promise.all([
            prisma.cursos.count(),

            prisma.alumno_curso.aggregate({
                _count: true
            }),

            prisma.alumno_curso.aggregate({
                _avg: {
                    calificacion: true
                }
            })
        ]);

        const estadisticas = {
            totalCursos,
            totalAlumnosEnCursos: alumnosEnCursos._count || 0,
            calificacionPromedio: calificacionPromedioCursos._avg?.calificacion || 0
        };

        logger.info('Estadísticas de cursos generadas exitosamente');
        return estadisticas;
    } catch (error) {
        logger.error(`Error en obtenerEstadisticasCursos: ${error.message}`);
        throw error;
    }
};

// Obtener estadísticas de habilidades
const obtenerEstadisticasHabilidades = async () => {
    try {
        const [
            totalHabilidades,
            alumnosConHabilidades,
            habilidadesPorAlumno
        ] = await Promise.all([
            prisma.habilidades.count(),

            prisma.alumno_habilidades.aggregate({
                _count: {
                    alumno_id: true
                }
            }),

            prisma.alumno_habilidades.aggregate({
                _count: true
            })
        ]);

        const estadisticas = {
            totalHabilidades,
            alumnosConHabilidades: alumnosConHabilidades._count?.alumno_id || 0,
            totalRegistrosHabilidades: alumnosConHabilidades._count?.alumno_id || 0
        };

        logger.info('Estadísticas de habilidades generadas exitosamente');
        return estadisticas;
    } catch (error) {
        logger.error(`Error en obtenerEstadisticasHabilidades: ${error.message}`);
        throw error;
    }
};

// Obtener panel completo consolidado
const obtenerPanelCompleto = async () => {
    try {
        const [
            metricas,
            distribucionCarrera,
            estadisticasEventos,
            estadisticasProyectos,
            topAlumnos,
            estadisticasCursos,
            estadisticasHabilidades
        ] = await Promise.all([
            obtenerMetricasPrincipales(),
            obtenerDistribucionPorCarrera(),
            obtenerEstadisticasEventos(),
            obtenerEstadisticasProyectos(),
            obtenerTopAlumnosPuntos(10),
            obtenerEstadisticasCursos(),
            obtenerEstadisticasHabilidades()
        ]);

        const panelCompleto = {
            timestamp: new Date().toISOString(),
            metricas,
            distribucionCarrera,
            estadisticasEventos,
            estadisticasProyectos,
            topAlumnos,
            estadisticasCursos,
            estadisticasHabilidades
        };

        logger.info('Panel completo del dashboard generado exitosamente');
        return panelCompleto;
    } catch (error) {
        logger.error(`Error en obtenerPanelCompleto: ${error.message}`);
        throw error;
    }
};

module.exports = {
    obtenerMetricasPrincipales,
    obtenerDistribucionPorCarrera,
    obtenerEstadisticasEventos,
    obtenerEstadisticasProyectos,
    obtenerTopAlumnosPuntos,
    obtenerEstadisticasCursos,
    obtenerEstadisticasHabilidades,
    obtenerPanelCompleto
};
