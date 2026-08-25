const prisma = require('../config/prisma');

class CuotaExcedidaError extends Error {
  constructor(departamentoId, actual, limite) {
    super(`El departamento ${departamentoId} ya tiene ${actual} novedades (límite: ${limite})`);
    this.name = 'CuotaExcedidaError';
    this.departamentoId = departamentoId;
    this.actual = actual;
    this.limite = limite;
  }
}

class NovedadNoEncontradaError extends Error {
  constructor() {
    super('Novedad no encontrada');
    this.name = 'NovedadNoEncontradaError';
  }
}

async function marcarComoDestacada(novedadId) {
  const limiteConfigurado = Number.parseInt(process.env.MAX_NOVEDADES_DEPARTAMENTO || '3', 10);
  const MAX_NOVEDADES = Number.isInteger(limiteConfigurado) && limiteConfigurado > 0
    ? limiteConfigurado
    : 3;

  return prisma.$transaction(
    async (tx) => {
      const elemento = await tx.actividades.findUnique({
        where: { id: BigInt(novedadId) }
      });

      if (!elemento) throw new NovedadNoEncontradaError();

      const departamentoId = elemento.departamento_id;
      if (!departamentoId) {
          throw new Error("Esta actividad no tiene un departamento asignado");
      }

      if (elemento.destacado) {
        return {
          ...elemento,
          id: elemento.id.toString(),
          departamento_id: departamentoId.toString(),
          validacion: 'Ya se encontraba destacada'
        };
      }

      const cantidadActual = await tx.actividades.count({
        where: {
          departamento_id: departamentoId,
          destacado: true
        },
      });

      if (cantidadActual >= MAX_NOVEDADES) {
        throw new CuotaExcedidaError(
          departamentoId.toString(),
          cantidadActual,
          MAX_NOVEDADES
        );
      }

      const elementoActualizado = await tx.actividades.update({
        where: { id: BigInt(novedadId) },
        data: { destacado: true }
      });

      return {
        ...elementoActualizado,
        id: elementoActualizado.id.toString(),
        departamento_id: elementoActualizado.departamento_id.toString(),
        validacion: 'Aprobada - Dentro de cuota'
      };
    },
    {
      isolationLevel: 'Serializable',
    }
  );
}

module.exports = {
  marcarComoDestacada,
  CuotaExcedidaError,
  NovedadNoEncontradaError
};