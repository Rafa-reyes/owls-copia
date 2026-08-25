const prisma = require('../config/prisma');
const logger = require('../config/logger');
const { encode } = require('html-entities');

const serializarBigInt = (valor) => JSON.parse(JSON.stringify(valor, (_, dato) =>
    typeof dato === 'bigint' ? dato.toString() : dato
));

const convertirId = (valor) => {
    try {
        if (valor === undefined || valor === null || valor === '') return null;
        const id = BigInt(valor);
        return id > 0n ? id : null;
    } catch {
        return null;
    }
};

const convertirFecha = (valor) => {
    if (valor === undefined || valor === null || valor === '') return null;
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? undefined : fecha;
};

const validarNombre = (nombre) => typeof nombre === 'string' && nombre.trim().length > 0 && nombre.trim().length <= 150;

const crearProyecto = async (req, res) => {
    const { nombre, inicio, fin, departamento_id } = req.body;
    const fechaInicio = convertirFecha(inicio);
    const fechaFin = convertirFecha(fin);
    const departamentoId = departamento_id === undefined ? null : convertirId(departamento_id);

    if (!validarNombre(nombre)) {
        return res.status(400).json({ mensaje: 'El nombre es obligatorio y debe tener hasta 150 caracteres' });
    }
    if (fechaInicio === undefined || fechaFin === undefined || (fechaInicio && fechaFin && fechaInicio > fechaFin)) {
        return res.status(400).json({ mensaje: 'Las fechas del proyecto no son validas' });
    }
    if (departamento_id !== undefined && departamentoId === null) {
        return res.status(400).json({ mensaje: 'departamento_id debe ser un entero positivo' });
    }

    try {
        const proyecto = await prisma.$transaction(async (tx) => {
            const actividad = await tx.actividades.create({
                data: {
                    tipo_actividad: 'Proyecto',
                    departamento_id: departamentoId
                }
            });

            return tx.proyectos.create({
                data: {
                    id: actividad.id,
                    nombre: encode(nombre.trim()),
                    inicio: fechaInicio,
                    fin: fechaFin
                },
                include: { actividades: true }
            });
        });

        return res.status(201).json({ mensaje: 'Proyecto creado exitosamente', data: serializarBigInt(proyecto) });
    } catch (error) {
        logger.error(`Error al crear proyecto: ${error.message}`);
        return res.status(500).json({ mensaje: 'Error interno al crear el proyecto' });
    }
};

const obtenerTodosLosProyectos = async (req, res) => {
    try {
        const proyectos = await prisma.proyectos.findMany({
            where: { deleted_at: null },
            orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
            take: 100,
            include: { actividades: true }
        });
        return res.status(200).json({ data: serializarBigInt(proyectos) });
    } catch (error) {
        logger.error(`Error al obtener proyectos: ${error.message}`);
        return res.status(500).json({ mensaje: 'Error al cargar los proyectos' });
    }
};

const obtenerProyecto = async (req, res) => {
    const id = convertirId(req.params.id);
    if (id === null) return res.status(400).json({ mensaje: 'Id de proyecto invalido' });

    try {
        const proyecto = await prisma.proyectos.findFirst({
            where: { id, deleted_at: null },
            include: { actividades: true, alumno_proyecto: true, proyecto_patrocinador: true }
        });
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        return res.status(200).json(serializarBigInt(proyecto));
    } catch (error) {
        logger.error(`Error al obtener proyecto: ${error.message}`);
        return res.status(500).json({ mensaje: 'Error al cargar el proyecto' });
    }
};

const actualizarProyecto = async (req, res) => {
    const id = convertirId(req.params.id);
    if (id === null) return res.status(400).json({ mensaje: 'Id de proyecto invalido' });

    const data = {};
    if (req.body.nombre !== undefined) {
        if (!validarNombre(req.body.nombre)) {
            return res.status(400).json({ mensaje: 'El nombre debe tener hasta 150 caracteres' });
        }
        data.nombre = encode(req.body.nombre.trim());
    }
    const inicioEnviado = req.body.inicio !== undefined;
    const finEnviado = req.body.fin !== undefined;
    if (inicioEnviado) data.inicio = convertirFecha(req.body.inicio);
    if (finEnviado) data.fin = convertirFecha(req.body.fin);
    if ((inicioEnviado && data.inicio === undefined) || (finEnviado && data.fin === undefined)) {
        return res.status(400).json({ mensaje: 'Las fechas del proyecto no son validas' });
    }
    data.updated_at = new Date();

    try {
        const existente = await prisma.proyectos.findFirst({ where: { id, deleted_at: null } });
        if (!existente) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });

        const fechaInicioFinal = inicioEnviado ? data.inicio : existente.inicio;
        const fechaFinFinal = finEnviado ? data.fin : existente.fin;
        if (fechaInicioFinal && fechaFinFinal && fechaInicioFinal > fechaFinFinal) {
            return res.status(400).json({ mensaje: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
        }

        const resultado = await prisma.proyectos.updateMany({ where: { id, deleted_at: null }, data });
        if (!resultado.count) return res.status(409).json({ mensaje: 'El proyecto cambio durante la actualizacion' });
        const proyecto = await prisma.proyectos.findUnique({ where: { id } });
        return res.status(200).json({ mensaje: 'Proyecto actualizado exitosamente', data: serializarBigInt(proyecto) });
    } catch (error) {
        logger.error(`Error al actualizar proyecto: ${error.message}`);
        return res.status(500).json({ mensaje: 'Error al actualizar el proyecto' });
    }
};

const eliminarProyecto = async (req, res) => {
    const id = convertirId(req.params.id);
    if (id === null) return res.status(400).json({ mensaje: 'Id de proyecto invalido' });

    try {
        const resultado = await prisma.proyectos.updateMany({
            where: { id, deleted_at: null },
            data: { deleted_at: new Date(), updated_at: new Date() }
        });
        if (!resultado.count) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        return res.status(200).json({ mensaje: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        logger.error(`Error al eliminar proyecto: ${error.message}`);
        return res.status(500).json({ mensaje: 'Error al eliminar el proyecto' });
    }
};

module.exports = { crearProyecto, obtenerTodosLosProyectos, obtenerProyecto, actualizarProyecto, eliminarProyecto };