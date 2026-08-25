const prisma = require('../config/prisma');
const { encode } = require('html-entities');
const logger = require('../config/logger');

//convertir el BigInt a texto
const serializarBigInt = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => typeof v === 'bigint' ? v.toString() : v));
const sanitizar = (str) => (typeof str === 'string' && str.trim() ? encode(str.trim()) : null);

const obtenerEventosVigentes = async (req, res) => {
    try {
        const hoy = new Date();
        
        const eventos = await prisma.eventos_internos.findMany({
            where: {
                fecha_fin: {
                    gte: hoy
                }
            },
            include: {
                tipos_evento: { select: { nombre: true } }
            },
            orderBy: { fecha_inicio: 'asc' } // Ordenamos por orden ascendente
        });

        return res.status(200).json(serializarBigInt(eventos));
    } catch (error) {
        logger.error(`Error en eventos: ${error.message}`);
        return res.status(500).json({ mensaje: "Error al cargar el calendario." });
    }
};

const crearEvento = async (req, res) => {
    try {
        const { tipo_evento_id, plataforma_id, nombre_evento, descripcion, fecha_inicio, fecha_fin } = req.body;

        if (!tipo_evento_id || !plataforma_id || !nombre_evento || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
        }

        const fInicio = new Date(fecha_inicio);
        const fFin = new Date(fecha_fin);
        const hoy = new Date();

        if (fInicio < hoy) {
            return res.status(400).json({ mensaje: "La fecha de inicio no puede estar en el pasado." });
        }

        if (fFin < fInicio) {
            return res.status(400).json({ mensaje: "La fecha de fin no puede ser anterior a la de inicio." });
        }

        const nombreLimpio = sanitizar(nombre_evento);
        const descLimpia = sanitizar(descripcion);

        const nuevoEvento = await prisma.$transaction(async (tx) => {
            const actividad = await tx.actividades.create({
                data: { tipo_actividad: 'Evento Interno' }
            });

            return await tx.eventos_internos.create({
                data: {
                    id: actividad.id,
                    tipo_evento_id: BigInt(tipo_evento_id),
                    plataforma_id: BigInt(plataforma_id),
                    nombre_evento: nombreLimpio,
                    descripcion: descLimpia,
                    fecha_inicio: fInicio,
                    fecha_fin: fFin
                }
            });
        });

        return res.status(201).json({
            mensaje: "Evento creado",
            data: serializarBigInt(nuevoEvento)
        });

    } catch (error) {
        logger.error(`Error al crear evento: ${error.message}`);
        return res.status(500).json({ mensaje: "Error interno al procesar el evento." });
    }
};

const obtenerTodosLosEventos = async (req, res) => {
    try {
        const [eventos, tipos_evento, plataformas] = await Promise.all([
            prisma.eventos_internos.findMany({
                include: {
                    tipos_evento: { select: { nombre: true } },
                    plataformas: { select: { nombre: true } }
                },
                orderBy: { fecha_inicio: 'desc' }
            }),
            prisma.tipos_evento.findMany({ select: { id: true, nombre: true } }),
            prisma.plataformas.findMany({ select: { id: true, nombre: true } })
        ]);

        return res.status(200).json({
            data: serializarBigInt(eventos),
            catalogos: serializarBigInt({ tipos: tipos_evento, plataformas })
        });
    } catch (error) {
        logger.error(`Error al obtener los eventos: ${error.message}`);
        return res.status(500).json({ mensaje: "Error al cargar los eventos." });
    }
};
module.exports = { obtenerEventosVigentes, crearEvento, obtenerTodosLosEventos };