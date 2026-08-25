const prisma = require('../config/prisma');
const logger = require('../config/logger');

// 1. INGRESO (Create)
const crearRegistro = async (req, res) => {
    try {
        const { matricula, nombre } = req.body;
        const nuevoRegistro = await prisma.alumno.create({
            data: {
                matricula: parseInt(matricula),
                nombre: nombre
            }
        });
        
        // Manejamos el BigInt para que no crashee la respuesta
        const dataSegura = { ...nuevoRegistro, id: nuevoRegistro.id.toString() };
        
        logger.info(`Nuevo registro admin creado: ${matricula}`);
        res.status(201).json({ mensaje: "Registro creado exitosamente", data: dataSegura });
    } catch (error) {
        logger.error(`Error en crearRegistro admin: ${error.message}`);
        res.status(500).json({ error: "Error al crear el registro" });
    }
};

// 2. LECTURA (Read)
const obtenerRegistros = async (req, res) => {
    try {
        const registros = await prisma.alumno.findMany();
        
        // Se converite BigInt a String
        const registrosSeguros = registros.map(reg => ({
            ...reg,
            id: reg.id.toString()
        }));
        
        res.status(200).json(registrosSeguros);
    } catch (error) {
        logger.error(`Error en obtenerRegistros admin: ${error.message}`);
        res.status(500).json({ error: "Error al obtener registros" });
    }
};

// 3. MODIFICACIÓN (Update)
const actualizarRegistro = async (req, res) => {
    try {
        const { id } = req.params; 
        const { nombre } = req.body;

        const registroActualizado = await prisma.alumno.update({
            where: { matricula: parseInt(id) },
            data: { nombre: nombre }
        });
        
        const dataSegura = { ...registroActualizado, id: registroActualizado.id.toString() };
        
        logger.info(`Registro admin actualizado: ${id}`);
        res.status(200).json({ mensaje: "Registro actualizado", data: dataSegura });
    } catch (error) {
        logger.error(`Error en actualizarRegistro admin: ${error.message}`);
        res.status(500).json({ error: "Error al actualizar (quizás no existe)" });
    }
};

// 4. ELIMINACIÓN (Delete)
const eliminarRegistro = async (req, res) => {
    try {
        const { id } = req.params;
        const registroEliminado = await prisma.alumno.delete({
            where: { matricula: parseInt(id) }
        });
        
        const dataSegura = { ...registroEliminado, id: registroEliminado.id.toString() };
        
        logger.warn(`Registro admin ELIMINADO: ${id}`);
        res.status(200).json({ mensaje: "Registro eliminado exitosamente", data: dataSegura });
    } catch (error) {
        logger.error(`Error en eliminarRegistro admin: ${error.message}`);
        res.status(500).json({ error: "Error al eliminar" });
    }
};

module.exports = {
    crearRegistro,
    obtenerRegistros,
    actualizarRegistro,
    eliminarRegistro
};