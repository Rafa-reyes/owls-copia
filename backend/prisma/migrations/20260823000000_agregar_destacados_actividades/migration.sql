-- AlterTable
ALTER TABLE "actividades"
ADD COLUMN "destacado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "departamento_id" BIGINT;

-- AddForeignKey
ALTER TABLE "actividades"
ADD CONSTRAINT "actividades_departamento_id_fkey"
FOREIGN KEY ("departamento_id") REFERENCES "departamentos"("id")
ON DELETE SET NULL ON UPDATE NO ACTION;
