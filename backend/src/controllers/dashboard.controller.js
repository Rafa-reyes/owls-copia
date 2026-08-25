const dashboardService = require('../services/dashboard.service');
const logger = require('../config/logger');

// Obtener todas las métricas principales
const getMetricasPrincipales = async (req, res) => {
    try {
        const metricas = await dashboardService.obtenerMetricasPrincipales();
        return res.status(200).json({
            success: true,
            data: metricas
        });
    } catch (error) {
        logger.error(`Error en getMetricasPrincipales: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener las métricas principales'
        });
    }
};

// Obtener distribución de alumnos por carrera
const getDistribucionCarrera = async (req, res) => {
    try {
        const distribucion = await dashboardService.obtenerDistribucionPorCarrera();
        return res.status(200).json({
            success: true,
            data: distribucion
        });
    } catch (error) {
        logger.error(`Error en getDistribucionCarrera: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener la distribución por carrera'
        });
    }
};

// Obtener estadísticas de eventos
const getEstadisticasEventos = async (req, res) => {
    try {
        const estadisticas = await dashboardService.obtenerEstadisticasEventos();
        return res.status(200).json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        logger.error(`Error en getEstadisticasEventos: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener las estadísticas de eventos'
        });
    }
};

// Obtener estadísticas de proyectos
const getEstadisticasProyectos = async (req, res) => {
    try {
        const estadisticas = await dashboardService.obtenerEstadisticasProyectos();
        return res.status(200).json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        logger.error(`Error en getEstadisticasProyectos: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener las estadísticas de proyectos'
        });
    }
};

// Obtener top alumnos por puntos
const getTopAlumnos = async (req, res) => {
    try {
        const limite = req.query.limite ? parseInt(req.query.limite) : 10;
        
        if (isNaN(limite) || limite < 1 || limite > 100) {
            return res.status(400).json({
                success: false,
                error: 'El parámetro limite debe ser un número entre 1 y 100'
            });
        }

        const topAlumnos = await dashboardService.obtenerTopAlumnosPuntos(limite);
        return res.status(200).json({
            success: true,
            cantidad: topAlumnos.length,
            data: topAlumnos
        });
    } catch (error) {
        logger.error(`Error en getTopAlumnos: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener el top de alumnos'
        });
    }
};

// Obtener estadísticas de cursos
const getEstadisticasCursos = async (req, res) => {
    try {
        const estadisticas = await dashboardService.obtenerEstadisticasCursos();
        return res.status(200).json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        logger.error(`Error en getEstadisticasCursos: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener las estadísticas de cursos'
        });
    }
};

// Obtener estadísticas de habilidades
const getEstadisticasHabilidades = async (req, res) => {
    try {
        const estadisticas = await dashboardService.obtenerEstadisticasHabilidades();
        return res.status(200).json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        logger.error(`Error en getEstadisticasHabilidades: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener las estadísticas de habilidades'
        });
    }
};

// Obtener panel completo consolidado
const getPanelCompleto = async (req, res) => {
    try {
        const panel = await dashboardService.obtenerPanelCompleto();
        return res.status(200).json({
            success: true,
            data: panel
        });
    } catch (error) {
        logger.error(`Error en getPanelCompleto: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener el panel completo del dashboard'
        });
    }
};

module.exports = {
    getMetricasPrincipales,
    getDistribucionCarrera,
    getEstadisticasEventos,
    getEstadisticasProyectos,
    getTopAlumnos,
    getEstadisticasCursos,
    getEstadisticasHabilidades,
    getPanelCompleto
};
