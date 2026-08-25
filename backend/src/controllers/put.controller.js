const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const { encode } = require('html-entities');
const logger = require('../config/logger');

// Limpia texto para prevenir XSS
function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  const limpio = texto.trim();
  return limpio ? encode(limpio) : '';
}

// Convierte BigInt a String para poder mandarlo en JSON
function convertirBigIntATexto(valor) {
  return typeof valor === 'bigint' ? valor.toString() : valor;
}

// Actualiza el perfil
const actualizarPerfil = async (peticion, respuesta) => {
  try {
    const idUsuario = peticion.user?.id;
    if (!idUsuario) {
      return respuesta.status(401).json({ mensaje: "No autorizado" });
    }

    const { descripcion, experiencia } = peticion.body || {};
    
    const datosAlumno = {};

    if (descripcion !== undefined) datosAlumno.descripcion = sanitizarTexto(descripcion);
    if (experiencia !== undefined) datosAlumno.experiencia = sanitizarTexto(experiencia);


    if (Object.keys(datosAlumno).length === 0) {
      return respuesta.status(400).json({ mensaje: "No enviaste campos válidos para actualizar" });
    }

    const idUsuarioBigInt = BigInt(idUsuario);


    const alumnoExistente = await prisma.alumnos.findFirst({
        where: { usuario_id: idUsuarioBigInt },
        select: { id: true }
    });

    if (!alumnoExistente) {
        return respuesta.status(404).json({ mensaje: "Perfil de alumno no encontrado para este usuario." });
    }

    await prisma.alumnos.update({
      where: { id: alumnoExistente.id },
      data: datosAlumno,
    });

    const alumnoActualizado = await prisma.alumnos.findUnique({
      where: { id: alumnoExistente.id },
      select: {
        id: true,
        descripcion: true,
        experiencia: true
      },
    });

    return respuesta.status(200).json({
      mensaje: "Perfil actualizado correctamente",
      usuario: {
        id: convertirBigIntATexto(alumnoActualizado?.id),
        descripcion: alumnoActualizado?.descripcion ?? null,
        experiencia: alumnoActualizado?.experiencia ?? null
      },
    });
    
  } catch (error) {
    logger.error(`Error al actualizar el perfil: ${error.message}`);
    return respuesta.status(500).json({ mensaje: "Error al actualizar el perfil" });
  }
};

// Obtiene la posicion en el ranking del alumno logueado
const obtenerRankingUsuario = async (peticion, respuesta) => {
  try {
    const idUsuario = peticion.user?.id;
    if (!idUsuario) {
      return respuesta.status(401).json({ mensaje: "No autorizado" });
    }

    const alumno = await prisma.alumnos.findUnique({
      where: { usuario_id: idUsuario },
      select: { id: true, nombre: true },
    });

    if (!alumno) {
      return respuesta.status(404).json({ mensaje: "Alumno no encontrado" });
    }

    const todosLosAlumnos = await prisma.alumnos.findMany({
      where: { activo: true },
      select: { id: true },
    });

    const sumaPuntosPorAlumno = await prisma.alumno_evento.groupBy({
      by: ['alumno_id'],
      _sum: { puntos_ganados: true },
    });

    const mapaPuntos = new Map();
    for (const alumnoItem of todosLosAlumnos) {
      mapaPuntos.set(alumnoItem.id.toString(), 0);
    }
    for (const fila of sumaPuntosPorAlumno) {
      mapaPuntos.set(fila.alumno_id.toString(), fila._sum.puntos_ganados || 0);
    }

    const listaOrdenada = Array.from(mapaPuntos.entries())
      .sort((a, b) => b[1] - a[1]);

    const idAlumnoTexto = alumno.id.toString();
    const posicionEnLista = listaOrdenada.findIndex(([idAlumno]) => idAlumno === idAlumnoTexto);
    const posicionRanking = posicionEnLista + 1;
    const puntosDelAlumno = mapaPuntos.get(idAlumnoTexto) || 0;
    const totalAlumnos = listaOrdenada.length;

    return respuesta.status(200).json({
      mensaje: "Ranking obtenido",
      idAlumno: convertirBigIntATexto(alumno.id),
      nombre: alumno.nombre,
      puntos: puntosDelAlumno,
      posicionRanking,
      totalAlumnos,
    });
  } catch (error) {
    logger.error(`Error al obtener el ranking de usuario: ${error.message}`);
    return respuesta.status(500).json({ mensaje: "Error al obtener el ranking" });
  }
};

const obtenerMiPerfil = async (req, res) => {
  try {
    const idUsuario = req.user?.id;
    if (!idUsuario) return res.status(401).json({ error: 'No autorizado' });

    const perfil = await prisma.alumnos.findFirst({
      where: { usuario_id: BigInt(idUsuario) },
      select: {
        id: true,
        nombre: true,
        ap_paterno: true,
        matricula: true,
        descripcion: true,
        experiencia: true,
        foto_perfil: true,
        usuarios: {
          select: {
            correo: true,
            usuario_rol: {
              select: {
                roles_usuario: { select: { nombre: true } }
              }
            }
          }
        },
        evaluaciones_cursos: {
          select: {
            total_puntos: true,
            evaluaciones_actitud: { select: { total_puntos_actitud: true } }
          }
        },
        alumno_insignia: {
          select: {
            insignias: {
              select: {
                id: true,
                nombre: true,
                icono: true,
                descripcion: true
              }
            }
          }
        }
      }
    });

    if (!perfil) return res.status(404).json({ error: 'Perfil no encontrado' });

    const rolesArray = perfil.usuarios?.usuario_rol?.map(ur => ur.roles_usuario?.nombre) || [];


    const insigniasArray = perfil.alumno_insignia?.map(ai => ({
      id: ai.insignias.id.toString(),
      nombre: ai.insignias.nombre,
      icono: ai.insignias.icono,
      descripcion: ai.insignias.descripcion
    })) || [];

    let puntosTotales = 0;
    perfil.evaluaciones_cursos.forEach(evaluacion => {
      puntosTotales += (evaluacion.total_puntos || 0);
      evaluacion.evaluaciones_actitud.forEach(actitud => {
        puntosTotales += (actitud.total_puntos_actitud || 0);
      });
    });

    res.status(200).json({
      id: perfil.id.toString(),
      nombre: perfil.nombre,
      ap_paterno: perfil.ap_paterno,
      matricula: perfil.matricula,
      descripcion: perfil.descripcion,
      experiencia: perfil.experiencia,
      foto_perfil: perfil.foto_perfil,
      correo: perfil.usuarios?.correo,
      roles: rolesArray,
      puntos: puntosTotales,
      insignias: insigniasArray
    });
  } catch (error) {
    logger.error(`Error al obtener perfil: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerEstadisticas = async (req, res) => {
    try {
        const idUsuario = req.user?.id;
        if (!idUsuario) return res.status(401).json({ error: 'No autorizado' });
        const alumno = await prisma.alumnos.findFirst({
            where: { usuario_id: BigInt(idUsuario) },
            include: {
                evaluaciones_cursos: {
                    include: {
                        evaluaciones_actitud: true 
                    }
                }
            }
        });

        if (!alumno || !alumno.evaluaciones_cursos || alumno.evaluaciones_cursos.length === 0) {
            return res.status(200).json({ data: [0, 0, 0, 0, 0] });
        }

        let sumatorias = { tecnica: 0, practica: 0, autonomia: 0, etica: 0, equipo: 0 };
        const totalEvals = alumno.evaluaciones_cursos.length;

        alumno.evaluaciones_cursos.forEach(ev => {
            // Hard Skills (0-100)
            const conceptos = ev.dominio_conceptos || 0;
            const problemas = ev.resolucion_problemas || 0;
            const herramientas = ev.uso_herramientas || 0;
            const aplicacion = ev.aplicacion_practica || 0;
            const autTecnica = ev.autonomia_tecnica || 0;

            // Soft Skills (0-100)
            let actResponsabilidad = 0, actEtica = 0, actProactividad = 0, actAdaptabilidad = 0, actColaboracion = 0;
            
            if (ev.evaluaciones_actitud && ev.evaluaciones_actitud.length > 0) {
                const actitud = ev.evaluaciones_actitud[0];
                actResponsabilidad = actitud.responsabilidad || 0;
                actEtica = actitud.etica_respeto || 0;
                actProactividad = actitud.proactividad || 0;
                actAdaptabilidad = actitud.adaptabilidad || 0;
                actColaboracion = actitud.colaboracion || 0;
            }

            // crear los ejes del pentágono
            sumatorias.tecnica += (conceptos + problemas);
            sumatorias.practica += (herramientas + aplicacion);
            sumatorias.autonomia += (autTecnica + actProactividad);
            sumatorias.etica += (actEtica + actResponsabilidad);
            sumatorias.equipo += (actColaboracion + actAdaptabilidad);
        });

        const maxTotalPuntos = totalEvals * 200;
        
        // Evitamos division
        if (maxTotalPuntos === 0) return res.status(200).json({ data: [0, 0, 0, 0, 0] });

        // se convierte a porcentaje
        const normalizar = (suma) => Math.round((suma / maxTotalPuntos) * 100);

        const dataRadar = [
            normalizar(sumatorias.tecnica),
            normalizar(sumatorias.practica),
            normalizar(sumatorias.autonomia),
            normalizar(sumatorias.etica),
            normalizar(sumatorias.equipo)
        ];

        res.status(200).json({ data: dataRadar });
    } catch (error) {
        res.status(500).json({ error: 'Error procesando estadísticas.' });
    }
};

// Añade esta función en tu put.controller.js
const cambiarPassword = async (req, res) => {
    try {
        const idUsuario = req.user?.id;
        if (!idUsuario) return res.status(401).json({ message: "No autorizado" });

        const { passwordActual, passwordNueva } = req.body;

        if (!passwordActual || !passwordNueva) {
            return res.status(400).json({ message: "Faltan datos requeridos." });
        }

        if (passwordNueva.trim().length < 8) {
            return res.status(400).json({ message: "La nueva contraseña debe tener al menos 8 caracteres." });
        }

        const usuarioDB = await prisma.usuarios.findUnique({
            where: { id: BigInt(idUsuario) },
            select: { password: true }
        });

        if (!usuarioDB) return res.status(404).json({ message: "Usuario no encontrado." });

        const esValida = await bcrypt.compare(passwordActual, usuarioDB.password);
        if (!esValida) {
            return res.status(400).json({ message: "La contraseña actual es incorrecta." });
        }

        //Si es valida, se guarda el nuevo password
        const saltRounds = 12;
        const nuevoHash = await bcrypt.hash(passwordNueva.trim(), saltRounds);

        await prisma.usuarios.update({
            where: { id: BigInt(idUsuario) },
            data: { password: nuevoHash }
        });

        return res.status(200).json({ message: "Contraseña actualizada exitosamente." });
    } catch (error) {
        logger.error(`Error al cambiar password: ${error.message}`);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};
module.exports = {
  actualizarPerfil,
  obtenerRankingUsuario, obtenerMiPerfil, obtenerEstadisticas, cambiarPassword
};