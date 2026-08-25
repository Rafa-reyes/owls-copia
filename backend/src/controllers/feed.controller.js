const prisma = require('../config/prisma');
const logger = require('../config/logger');

const serializarBigInt = (valor) => JSON.parse(JSON.stringify(valor, (_, dato) =>
    typeof dato === 'bigint' ? dato.toString() : dato
));

const obtenerParametroEntero = (valor) => {
    if (valor === undefined) return null;
    if (typeof valor !== 'string' || !/^\d+$/.test(valor)) return undefined;
    const numero = Number(valor);
    return Number.isSafeInteger(numero) ? numero : undefined;
};

const obtenerFeed = async (req, res) => {
    const limiteParametro = obtenerParametroEntero(req.query.limite);
    const paginaParametro = obtenerParametroEntero(req.query.pagina);
    if (limiteParametro === undefined || paginaParametro === undefined) {
        return res.status(400).json({ mensaje: 'limite y pagina deben ser enteros validos' });
    }
    const limite = Number.isInteger(limiteParametro) ? Math.min(Math.max(limiteParametro, 1), 30) : 10;
    const pagina = Number.isInteger(paginaParametro) ? Math.min(Math.max(paginaParametro, 1), 1000) : 1;

    try {
        const actividades = await prisma.actividades.findMany({
            where: {
                destacado: true,
                OR: [
                    { eventos_internos: { is: { fecha_fin: { gte: new Date() } } } },
                    { cursos: { is: { deleted_at: null } } },
                    { proyectos: { is: { deleted_at: null } } }
                ]
            },
            orderBy: [{ updated_at: 'desc' }, { id: 'desc' }],
            skip: (pagina - 1) * limite,
            take: limite,
            select: {
                id: true,
                tipo_actividad: true,
                created_at: true,
                updated_at: true,
                eventos_internos: {
                    select: { nombre_evento: true, descripcion: true, fecha_inicio: true, fecha_fin: true }
                },
                cursos: {
                    select: { nombre: true, descripcion: true, fecha_inicio: true, fecha_terminacion: true }
                },
                proyectos: {
                    select: { nombre: true, inicio: true, fin: true }
                }
            }
        });

        const data = actividades.map((actividad) => {
            const contenido = actividad.eventos_internos || actividad.cursos || actividad.proyectos;
            const esEvento = Boolean(actividad.eventos_internos);
            return {
                id: actividad.id,
                tipo: esEvento ? 'evento' : actividad.cursos ? 'curso' : 'proyecto',
                titulo: contenido.nombre_evento || contenido.nombre,
                descripcion: contenido.descripcion || null,
                fecha_inicio: contenido.fecha_inicio || contenido.inicio || null,
                fecha_fin: contenido.fecha_fin || contenido.fecha_terminacion || contenido.fin || null,
                created_at: actividad.created_at,
                updated_at: actividad.updated_at
            };
        });

        return res.status(200).json(serializarBigInt({ data, pagina, limite, cantidad: data.length }));
    } catch (error) {
        logger.error(`Error al obtener feed: ${error.message}`);
        return res.status(500).json({ mensaje: 'Error al cargar el feed de noticias' });
    }
};

module.exports = { obtenerFeed };