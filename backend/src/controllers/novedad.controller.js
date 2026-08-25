const {
  marcarComoDestacada,
  CuotaExcedidaError,
} = require('../services/cuotas.service');

const marcarDestacado = async (req, res) => {
  try {
    let novedadId;
    try {
      novedadId = BigInt(req.params.id);
    } catch {
      novedadId = null;
    }

    if (novedadId === null || novedadId <= 0n) {
      return res.status(400).json({ mensaje: 'Id de novedad inválido' });
    }

    const novedadActualizada = await marcarComoDestacada(novedadId);

    return res.status(200).json({
      mensaje: 'Novedad validada exitosamente',
      novedad: novedadActualizada,
    });
  } catch (error) {
    if (error.name === 'NovedadNoEncontradaError') {
      return res.status(404).json({ mensaje: 'Novedad no encontrada' });
    }

    if (error instanceof CuotaExcedidaError) {
      // 409 Conflict: la cuota del departamento ya está llena
      return res.status(409).json({
        mensaje: `Se alcanzó el límite de ${error.limite} novedades para este departamento`,
        departamentoId: error.departamentoId,
        actual: error.actual,
        limite: error.limite,
      });
    }

    // Conflicto de serialización de Prisma: dos transacciones chocaron
    if (error.code === 'P2034') {
      return res.status(409).json({
        mensaje: 'Conflicto de concurrencia, intenta nuevamente',
      });
    }

    console.error('Error interno al validar novedad:', error);
    return res.status(500).json({ mensaje: 'Error al procesar la novedad' });
  }
};

module.exports = { marcarDestacado };