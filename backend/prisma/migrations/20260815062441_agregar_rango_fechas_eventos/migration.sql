/*
  Warnings:

  - You are about to drop the column `departamento_id` on the `alumnos` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_evento` on the `eventos_internos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "alumnos" DROP CONSTRAINT "alumnos_departamento_id_fkey";

-- AlterTable
ALTER TABLE "alumnos" DROP COLUMN "departamento_id",
ADD COLUMN     "apodo" VARCHAR(50),
ADD COLUMN     "nivel_educacion" VARCHAR(100),
ADD COLUMN     "sexo" VARCHAR(10),
ADD COLUMN     "ubicacion" VARCHAR(150);

-- AlterTable
ALTER TABLE "eventos_internos" DROP COLUMN "fecha_evento",
ADD COLUMN     "fecha_fin" TIMESTAMP(0),
ADD COLUMN     "fecha_inicio" TIMESTAMP(0);

-- CreateTable
CREATE TABLE "alumno_departamento" (
    "alumno_id" BIGINT NOT NULL,
    "departamento_id" BIGINT NOT NULL,

    CONSTRAINT "alumno_departamento_pkey" PRIMARY KEY ("alumno_id","departamento_id")
);

-- AddForeignKey
ALTER TABLE "alumno_departamento" ADD CONSTRAINT "alumno_departamento_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_departamento" ADD CONSTRAINT "alumno_departamento_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
