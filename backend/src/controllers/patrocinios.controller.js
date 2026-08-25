const prisma = require('../config/prisma');
const logger = require('../config/logger');
const { encode } = require('html-entities');

// Funcion de sanitizacion de texto
const sanitizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return texto;
    }

    return encode(texto)
        .trim()
        .replace(/\s+/g, ' ')
        .substring(0, 255);
};

// Crear patrocinador (solo Admin)
const crearPatrocinador = async (req, res) => {
    try {
        const { tipo_entidad_id, nombre_patrocinador, calle, numero_exterior, colonia, codigo_postal, numero_interior, telefono, correo } = req.body;

        if (!tipo_entidad_id || !nombre_patrocinador) {
            return res.status(400).json({ error: 'Tipo de entidad y nombre del patrocinador son obligatorios' });
        }

        // PREVENCIÓN DE ERROR 500: Validar numérico antes del BigInt
        if (isNaN(tipo_entidad_id)) {
            return res.status(400).json({ error: 'Debe ser un valor numérico.' });
        }

        // Sanitizar todas las cadenas de texto
        const datosSanitizados = {
            tipo_entidad_id: BigInt(tipo_entidad_id),
            nombre_patrocinador: sanitizarTexto(nombre_patrocinador),
            calle: calle ? sanitizarTexto(calle) : null,
            numero_exterior: numero_exterior && !isNaN(numero_exterior) ? parseInt(numero_exterior) : null,
            colonia: colonia ? sanitizarTexto(colonia) : null,
            codigo_postal: codigo_postal && !isNaN(codigo_postal) ? parseInt(codigo_postal) : null,
            numero_interior: numero_interior && !isNaN(numero_interior) ? parseInt(numero_interior) : null,
            telefono: telefono ? sanitizarTexto(telefono) : null,
            correo: correo ? sanitizarTexto(correo) : null
        };

        const tipoEntidadExiste = await prisma.tipos_entidad.findUnique({ where: { id: datosSanitizados.tipo_entidad_id } });
        if (!tipoEntidadExiste) return res.status(404).json({ error: 'Tipo de entidad no encontrado' });

        const patrocinador = await prisma.patrocinadores.create({
            data: datosSanitizados,
            include: { tipos_entidad: true }
        });

        // Convertir el ID BigInt a string para el JSON
        const patrocinadorSerializado = JSON.parse(JSON.stringify(patrocinador, (k, v) => typeof v === 'bigint' ? v.toString() : v));
        return res.status(201).json({ mensaje: 'Patrocinador creado', patrocinador: patrocinadorSerializado });
    } catch (error) {
        logger.error(`Error al crear el patrocinador: ${error.message}`);
        return res.status(500).json({ error: 'Error al crear el patrocinador' });
    }
};

// Actualizar patrocinador (solo Admin)
const actualizarPatrocinador = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_entidad_id, nombre_patrocinador, calle, numero_exterior, colonia, codigo_postal, numero_interior, telefono, correo } = req.body;

        if (isNaN(id)) return res.status(400).json({ error: 'El ID debe ser numérico' });

        const patrocinadorExistente = await prisma.patrocinadores.findUnique({ where: { id: BigInt(id) } });
        if (!patrocinadorExistente) return res.status(404).json({ error: 'Patrocinador no encontrado' });

        const datosActualizar = {};
        if (tipo_entidad_id) {
            if (isNaN(tipo_entidad_id)) {
                return res.status(400).json({
                    error: 'tipo_entidad_id debe ser numerico'
                });
            }
            datosActualizar.tipo_entidad_id = BigInt(tipo_entidad_id);
        }
        if (nombre_patrocinador) datosActualizar.nombre_patrocinador = sanitizarTexto(nombre_patrocinador);
        if (calle !== undefined) datosActualizar.calle = calle ? sanitizarTexto(calle) : null;
        if (numero_exterior !== undefined) datosActualizar.numero_exterior = numero_exterior && !isNaN(numero_exterior) ? parseInt(numero_exterior) : null;
        if (colonia !== undefined) datosActualizar.colonia = colonia ? sanitizarTexto(colonia) : null;
        if (codigo_postal !== undefined) datosActualizar.codigo_postal = codigo_postal && !isNaN(codigo_postal) ? parseInt(codigo_postal) : null;
        if (numero_interior !== undefined) datosActualizar.numero_interior = numero_interior && !isNaN(numero_interior) ? parseInt(numero_interior) : null;
        if (telefono !== undefined) datosActualizar.telefono = telefono ? sanitizarTexto(telefono) : null;
        if (correo !== undefined) datosActualizar.correo = correo ? sanitizarTexto(correo) : null;

        const patrocinador = await prisma.patrocinadores.update({
            where: { id: BigInt(id) },
            data: datosActualizar,
            include: { tipos_entidad: true }
        });

        const patrocinadorSerializado = JSON.parse(JSON.stringify(patrocinador, (k, v) => typeof v === 'bigint' ? v.toString() : v));
        return res.status(200).json({ mensaje: 'Patrocinador actualizado', patrocinador: patrocinadorSerializado });
    } catch (error) {
        logger.error(`Error al actualizar el patrocinador: ${error.message}`);
        return res.status(500).json({ error: 'Error al actualizar el patrocinador' });
    }
};

// Eliminar patrocinador (solo Admin)
const eliminarPatrocinador = async (req, res) => {
    try {
        const { id } = req.params;

        const patrocinadorExistente = await prisma.patrocinadores.findUnique({
            where: { id: BigInt(id) }
        });

        if (!patrocinadorExistente) {
            return res.status(404).json({ error: 'Patrocinador no encontrado' });
        }

        await prisma.patrocinadores.delete({
            where: { id: BigInt(id) }
        });

        logger.info(`Patrocinador eliminado: ${id}`);

        return res.status(200).json({
            mensaje: 'Patrocinador eliminado exitosamente'
        });
    } catch (error) {
        logger.error(`Error en eliminarPatrocinador: ${error.message}`);
        return res.status(500).json({ error: 'Error al eliminar el patrocinador' });
    }
};

// Obtener todos los patrocinadores (publico - solo lectura)
const obtenerTodosPatrocinadores = async (req, res) => {
    try {
        const patrocinadores = await prisma.patrocinadores.findMany({
            include: {
                tipos_entidad: true
            },
            orderBy: {
                nombre_patrocinador: 'asc'
            }
        });

        return res.status(200).json({
            total: patrocinadores.length,
            patrocinadores
        });
    } catch (error) {
        logger.error(`Error en obtenerTodosPatrocinadores: ${error.message}`);
        return res.status(500).json({ error: 'Error al obtener patrocinadores' });
    }
};

// Obtener patrocinador por ID (publico - solo lectura)
const obtenerPatrocinadorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const patrocinador = await prisma.patrocinadores.findUnique({
            where: { id: BigInt(id) },
            include: {
                tipos_entidad: true,
                proyecto_patrocinador: {
                    include: {
                        proyectos: true
                    }
                }
            }
        });

        if (!patrocinador) {
            return res.status(404).json({ error: 'Patrocinador no encontrado' });
        }

        return res.status(200).json(patrocinador);
    } catch (error) {
        logger.error(`Error en obtenerPatrocinadorPorId: ${error.message}`);
        return res.status(500).json({ error: 'Error al obtener el patrocinador' });
    }
};

// Obtener patrocinadores por tipo de entidad (publico - solo lectura)
const obtenerPatrocinadoresPorTipo = async (req, res) => {
    try {
        const { tipo_entidad_id } = req.params;

        const patrocinadores = await prisma.patrocinadores.findMany({
            where: { tipo_entidad_id: BigInt(tipo_entidad_id) },
            include: {
                tipos_entidad: true
            },
            orderBy: {
                nombre_patrocinador: 'asc'
            }
        });

        return res.status(200).json({
            total: patrocinadores.length,
            patrocinadores
        });
    } catch (error) {
        logger.error(`Error en obtenerPatrocinadoresPorTipo: ${error.message}`);
        return res.status(500).json({ error: 'Error al obtener patrocinadores' });
    }
};

module.exports = {
    crearPatrocinador,
    actualizarPatrocinador,
    eliminarPatrocinador,
    obtenerTodosPatrocinadores,
    obtenerPatrocinadorPorId,
    obtenerPatrocinadoresPorTipo
};
