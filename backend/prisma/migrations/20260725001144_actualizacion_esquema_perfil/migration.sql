-- CreateTable
CREATE TABLE "actividades" (
    "id" BIGSERIAL NOT NULL,
    "tipo_actividad" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumno_cargo" (
    "alumno_id" BIGINT NOT NULL,
    "cargo_id" BIGINT NOT NULL,

    CONSTRAINT "alumno_cargo_pkey" PRIMARY KEY ("alumno_id","cargo_id")
);

-- CreateTable
CREATE TABLE "alumno_curso" (
    "alumno_id" BIGINT NOT NULL,
    "curso_id" BIGINT NOT NULL,
    "estado_curso_id" BIGINT NOT NULL,
    "fecha_inscripcion" DATE NOT NULL DEFAULT CURRENT_DATE,
    "calificacion" DECIMAL(4,2),

    CONSTRAINT "alumno_curso_pkey" PRIMARY KEY ("alumno_id","curso_id")
);

-- CreateTable
CREATE TABLE "alumno_evento" (
    "id" BIGSERIAL NOT NULL,
    "evento_interno_id" BIGINT NOT NULL,
    "alumno_id" BIGINT NOT NULL,
    "comentarios" TEXT,
    "puntos_ganados" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "alumno_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumno_habilidades" (
    "id" BIGSERIAL NOT NULL,
    "alumno_id" BIGINT NOT NULL,
    "habilidad_id" BIGINT NOT NULL,
    "fecha_inicio" DATE,
    "nivel_habilidad_id" BIGINT NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "alumno_habilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumno_proyecto" (
    "alumno_id" BIGINT NOT NULL,
    "proyecto_id" BIGINT NOT NULL,
    "rol_proyecto_id" BIGINT NOT NULL,
    "fecha_ingreso" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "alumno_proyecto_pkey" PRIMARY KEY ("alumno_id","proyecto_id")
);

-- CreateTable
CREATE TABLE "alumno_salida" (
    "alumno_id" BIGINT NOT NULL,
    "salida_id" BIGINT NOT NULL,
    "estado_asistencia" VARCHAR(255),

    CONSTRAINT "alumno_salida_pkey" PRIMARY KEY ("alumno_id","salida_id")
);

-- CreateTable
CREATE TABLE "alumnos" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "matricula" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ap_paterno" VARCHAR(100),
    "ap_materno" VARCHAR(100),
    "carrera_id" BIGINT,
    "ciclo" VARCHAR(255),
    "fecha_nacimiento" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "foto_perfil" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),
    "descripcion" TEXT,
    "experiencia" TEXT,
    "departamento_id" BIGINT,
    "puntos_extra" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "alumnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carreras" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificados" (
    "id" BIGSERIAL NOT NULL,
    "alumno_id" BIGINT NOT NULL,
    "curso_id" BIGINT,
    "es_interno" BOOLEAN NOT NULL DEFAULT false,
    "plataforma" VARCHAR(100),
    "fecha_emision" DATE,
    "imagen_certificado" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "certificados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "nombre_empresa" VARCHAR(150) NOT NULL,
    "contacto_principal" VARCHAR(150),
    "industria" VARCHAR(100),
    "telefono" VARCHAR(20),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" BIGSERIAL NOT NULL,
    "cliente_id" BIGINT NOT NULL,
    "servicio_id" BIGINT NOT NULL,
    "estado_contrato_id" BIGINT NOT NULL,
    "fecha_firma" DATE,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" BIGINT NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "fecha_inicio" DATE,
    "fecha_terminacion" DATE,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_contrato" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "estados_contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_curso" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "estados_curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluaciones_actitud" (
    "id" BIGSERIAL NOT NULL,
    "evaluacion_curso_id" BIGINT NOT NULL,
    "responsabilidad" INTEGER,
    "etica_respeto" INTEGER,
    "proactividad" INTEGER,
    "adaptabilidad" INTEGER,
    "colaboracion" INTEGER,
    "total_puntos_actitud" INTEGER,
    "comentarios_actitud" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "evaluaciones_actitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluaciones_cursos" (
    "id" BIGSERIAL NOT NULL,
    "alumno_id" BIGINT NOT NULL,
    "curso_id" BIGINT NOT NULL,
    "dominio_conceptos" INTEGER,
    "resolucion_problemas" INTEGER,
    "uso_herramientas" INTEGER,
    "autonomia_tecnica" INTEGER,
    "aplicacion_practica" INTEGER,
    "total_puntos" INTEGER,
    "nivel" INTEGER,
    "comentarios" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "evaluaciones_cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_internos" (
    "id" BIGINT NOT NULL,
    "tipo_evento_id" BIGINT NOT NULL,
    "plataforma_id" BIGINT NOT NULL,
    "nombre_evento" VARCHAR(150),
    "fecha_evento" TIMESTAMP(0),
    "descripcion" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "eventos_internos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "habilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_niveles" (
    "id" BIGSERIAL NOT NULL,
    "alumno_habilidad_id" BIGINT NOT NULL,
    "nivel_habilidad_id" BIGINT NOT NULL,
    "fecha_cambio" DATE NOT NULL DEFAULT CURRENT_DATE,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "historial_niveles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidentes" (
    "id" BIGSERIAL NOT NULL,
    "proyecto_auditoria_id" BIGINT NOT NULL,
    "tipo_incidente" VARCHAR(150),
    "impacto" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "migration" VARCHAR(255) NOT NULL,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveles_habilidad" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "niveles_habilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrocinadores" (
    "id" BIGSERIAL NOT NULL,
    "tipo_entidad_id" BIGINT NOT NULL,
    "nombre_patrocinador" VARCHAR(150) NOT NULL,
    "calle" VARCHAR(150),
    "numero_exterior" INTEGER,
    "colonia" VARCHAR(150),
    "codigo_postal" INTEGER,
    "numero_interior" INTEGER,
    "telefono" VARCHAR(20),
    "correo" VARCHAR(150),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "patrocinadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plataformas" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "plataformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyecto_patrocinador" (
    "proyecto_id" BIGINT NOT NULL,
    "patrocinador_id" BIGINT NOT NULL,
    "descripcion_ayuda" TEXT,
    "fecha_patrocinio" DATE,
    "monto_estimado" DECIMAL(12,2),

    CONSTRAINT "proyecto_patrocinador_pkey" PRIMARY KEY ("proyecto_id","patrocinador_id")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "id" BIGINT NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "inicio" DATE,
    "fin" DATE,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyectos_auditoria" (
    "id" BIGINT NOT NULL,
    "contrato_id" BIGINT NOT NULL,
    "alcance" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "proyectos_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_proyecto" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "roles_proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles_usuario" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "roles_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salidas" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "fecha" DATE,
    "hora" TIME(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "salidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "severidades" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "severidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_entidad" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "tipos_entidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_evento" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "tipos_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_actividad" (
    "tutor_id" BIGINT NOT NULL,
    "actividad_id" BIGINT NOT NULL,
    "rol" VARCHAR(50),

    CONSTRAINT "tutor_actividad_pkey" PRIMARY KEY ("tutor_id","actividad_id")
);

-- CreateTable
CREATE TABLE "tutores" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "ap_paterno" VARCHAR(150),
    "ap_materno" VARCHAR(150),
    "telefono" VARCHAR(20),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "tutores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" BIGSERIAL NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "intentos_fallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_hasta" TIMESTAMP(0),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerabilidades" (
    "id" BIGSERIAL NOT NULL,
    "proyecto_auditoria_id" BIGINT NOT NULL,
    "alumno_id" BIGINT,
    "severidad_id" BIGINT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "estado" VARCHAR(50) NOT NULL DEFAULT 'Abierta',
    "evidencia" TEXT,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "vulnerabilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departamentos" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(0),

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insignias" (
    "id" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "icono" VARCHAR(150),
    "descripcion" TEXT,

    CONSTRAINT "insignias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alumno_insignia" (
    "alumno_id" BIGINT NOT NULL,
    "insignia_id" BIGINT NOT NULL,
    "fecha_ganada" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "alumno_insignia_pkey" PRIMARY KEY ("alumno_id","insignia_id")
);

-- CreateTable
CREATE TABLE "usuario_rol" (
    "usuario_id" BIGINT NOT NULL,
    "rol_id" BIGINT NOT NULL,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alumnos_matricula_unique" ON "alumnos"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_unique" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "alumno_cargo" ADD CONSTRAINT "alumno_cargo_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_cargo" ADD CONSTRAINT "alumno_cargo_cargo_id_foreign" FOREIGN KEY ("cargo_id") REFERENCES "cargos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_curso" ADD CONSTRAINT "alumno_curso_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_curso" ADD CONSTRAINT "alumno_curso_curso_id_foreign" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_curso" ADD CONSTRAINT "alumno_curso_estado_curso_id_foreign" FOREIGN KEY ("estado_curso_id") REFERENCES "estados_curso"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_evento" ADD CONSTRAINT "alumno_evento_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_evento" ADD CONSTRAINT "alumno_evento_evento_interno_id_foreign" FOREIGN KEY ("evento_interno_id") REFERENCES "eventos_internos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_habilidades" ADD CONSTRAINT "alumno_habilidades_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_habilidades" ADD CONSTRAINT "alumno_habilidades_habilidad_id_foreign" FOREIGN KEY ("habilidad_id") REFERENCES "habilidades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_habilidades" ADD CONSTRAINT "alumno_habilidades_nivel_habilidad_id_foreign" FOREIGN KEY ("nivel_habilidad_id") REFERENCES "niveles_habilidad"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_proyecto" ADD CONSTRAINT "alumno_proyecto_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_proyecto" ADD CONSTRAINT "alumno_proyecto_proyecto_id_foreign" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_proyecto" ADD CONSTRAINT "alumno_proyecto_rol_proyecto_id_foreign" FOREIGN KEY ("rol_proyecto_id") REFERENCES "roles_proyecto"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_salida" ADD CONSTRAINT "alumno_salida_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_salida" ADD CONSTRAINT "alumno_salida_salida_id_foreign" FOREIGN KEY ("salida_id") REFERENCES "salidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_carrera_id_foreign" FOREIGN KEY ("carrera_id") REFERENCES "carreras"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_usuario_id_foreign" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumnos" ADD CONSTRAINT "alumnos_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "departamentos"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_curso_id_foreign" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuario_id_foreign" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_cliente_id_foreign" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_estado_contrato_id_foreign" FOREIGN KEY ("estado_contrato_id") REFERENCES "estados_contrato"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_servicio_id_foreign" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_id_foreign" FOREIGN KEY ("id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evaluaciones_actitud" ADD CONSTRAINT "evaluaciones_actitud_evaluacion_curso_id_foreign" FOREIGN KEY ("evaluacion_curso_id") REFERENCES "evaluaciones_cursos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evaluaciones_cursos" ADD CONSTRAINT "evaluaciones_cursos_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evaluaciones_cursos" ADD CONSTRAINT "evaluaciones_cursos_curso_id_foreign" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventos_internos" ADD CONSTRAINT "eventos_internos_id_foreign" FOREIGN KEY ("id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventos_internos" ADD CONSTRAINT "eventos_internos_plataforma_id_foreign" FOREIGN KEY ("plataforma_id") REFERENCES "plataformas"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventos_internos" ADD CONSTRAINT "eventos_internos_tipo_evento_id_foreign" FOREIGN KEY ("tipo_evento_id") REFERENCES "tipos_evento"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historial_niveles" ADD CONSTRAINT "historial_niveles_alumno_habilidad_id_foreign" FOREIGN KEY ("alumno_habilidad_id") REFERENCES "alumno_habilidades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "historial_niveles" ADD CONSTRAINT "historial_niveles_nivel_habilidad_id_foreign" FOREIGN KEY ("nivel_habilidad_id") REFERENCES "niveles_habilidad"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_proyecto_auditoria_id_foreign" FOREIGN KEY ("proyecto_auditoria_id") REFERENCES "proyectos_auditoria"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrocinadores" ADD CONSTRAINT "patrocinadores_tipo_entidad_id_foreign" FOREIGN KEY ("tipo_entidad_id") REFERENCES "tipos_entidad"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto_patrocinador" ADD CONSTRAINT "proyecto_patrocinador_patrocinador_id_foreign" FOREIGN KEY ("patrocinador_id") REFERENCES "patrocinadores"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyecto_patrocinador" ADD CONSTRAINT "proyecto_patrocinador_proyecto_id_foreign" FOREIGN KEY ("proyecto_id") REFERENCES "proyectos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_id_foreign" FOREIGN KEY ("id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos_auditoria" ADD CONSTRAINT "proyectos_auditoria_contrato_id_foreign" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proyectos_auditoria" ADD CONSTRAINT "proyectos_auditoria_id_foreign" FOREIGN KEY ("id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tutor_actividad" ADD CONSTRAINT "tutor_actividad_actividad_id_foreign" FOREIGN KEY ("actividad_id") REFERENCES "actividades"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tutor_actividad" ADD CONSTRAINT "tutor_actividad_tutor_id_foreign" FOREIGN KEY ("tutor_id") REFERENCES "tutores"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tutores" ADD CONSTRAINT "tutores_usuario_id_foreign" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vulnerabilidades" ADD CONSTRAINT "vulnerabilidades_alumno_id_foreign" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vulnerabilidades" ADD CONSTRAINT "vulnerabilidades_proyecto_auditoria_id_foreign" FOREIGN KEY ("proyecto_auditoria_id") REFERENCES "proyectos_auditoria"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vulnerabilidades" ADD CONSTRAINT "vulnerabilidades_severidad_id_foreign" FOREIGN KEY ("severidad_id") REFERENCES "severidades"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alumno_insignia" ADD CONSTRAINT "alumno_insignia_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alumno_insignia" ADD CONSTRAINT "alumno_insignia_insignia_id_fkey" FOREIGN KEY ("insignia_id") REFERENCES "insignias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles_usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
