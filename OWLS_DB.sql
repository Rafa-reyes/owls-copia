--
-- PostgreSQL database dump
--

\restrict l9GT64lOQdr4HCbUaIbgGawKZ0T5ZfVJdfk0mWNR8YVOSkzUTHDIebS4NupcXdz

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-03 22:21:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 57357)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 250 (class 1259 OID 58139)
-- Name: actividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actividades (
    id bigint NOT NULL,
    tipo_actividad character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.actividades OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 58138)
-- Name: actividades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.actividades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actividades_id_seq OWNER TO postgres;

--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 249
-- Name: actividades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.actividades_id_seq OWNED BY public.actividades.id;


--
-- TOC entry 266 (class 1259 OID 58319)
-- Name: alumno_cargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno_cargo (
    alumno_id bigint NOT NULL,
    cargo_id bigint NOT NULL
);


ALTER TABLE public.alumno_cargo OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 58336)
-- Name: alumno_curso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno_curso (
    alumno_id bigint NOT NULL,
    curso_id bigint NOT NULL,
    estado_curso_id bigint NOT NULL,
    fecha_inscripcion date DEFAULT CURRENT_DATE NOT NULL,
    calificacion numeric(4,2)
);


ALTER TABLE public.alumno_curso OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 58405)
-- Name: alumno_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno_evento (
    id bigint NOT NULL,
    evento_interno_id bigint NOT NULL,
    alumno_id bigint NOT NULL,
    comentarios text,
    puntos_ganados integer DEFAULT 0 NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.alumno_evento OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 58404)
-- Name: alumno_evento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumno_evento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alumno_evento_id_seq OWNER TO postgres;

--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 270
-- Name: alumno_evento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumno_evento_id_seq OWNED BY public.alumno_evento.id;


--
-- TOC entry 274 (class 1259 OID 58446)
-- Name: alumno_habilidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno_habilidades (
    id bigint NOT NULL,
    alumno_id bigint NOT NULL,
    habilidad_id bigint NOT NULL,
    fecha_inicio date,
    nivel_habilidad_id bigint NOT NULL,
    descripcion text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.alumno_habilidades OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 58445)
-- Name: alumno_habilidades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumno_habilidades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alumno_habilidades_id_seq OWNER TO postgres;

--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 273
-- Name: alumno_habilidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumno_habilidades_id_seq OWNED BY public.alumno_habilidades.id;


--
-- TOC entry 268 (class 1259 OID 58361)
-- Name: alumno_proyecto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno_proyecto (
    alumno_id bigint NOT NULL,
    proyecto_id bigint NOT NULL,
    rol_proyecto_id bigint NOT NULL,
    fecha_ingreso date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.alumno_proyecto OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 58386)
-- Name: alumno_salida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumno_salida (
    alumno_id bigint NOT NULL,
    salida_id bigint NOT NULL,
    estado_asistencia character varying(255),
    CONSTRAINT alumno_salida_estado_asistencia_check CHECK (((estado_asistencia)::text = ANY ((ARRAY['Presente'::character varying, 'Ausente'::character varying, 'Justificado'::character varying])::text[])))
);


ALTER TABLE public.alumno_salida OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 58234)
-- Name: alumnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnos (
    id bigint NOT NULL,
    usuario_id bigint NOT NULL,
    matricula integer NOT NULL,
    nombre character varying(100) NOT NULL,
    ap_paterno character varying(100),
    ap_materno character varying(100),
    carrera_id bigint,
    ciclo character varying(255),
    fecha_nacimiento date,
    activo boolean DEFAULT true NOT NULL,
    foto_perfil text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    CONSTRAINT alumnos_ciclo_check CHECK (((ciclo)::text = ANY ((ARRAY['semestral'::character varying, 'cuatrimestral'::character varying])::text[])))
);


ALTER TABLE public.alumnos OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 58233)
-- Name: alumnos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumnos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alumnos_id_seq OWNER TO postgres;

--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 258
-- Name: alumnos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumnos_id_seq OWNED BY public.alumnos.id;


--
-- TOC entry 226 (class 1259 OID 58029)
-- Name: cargos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cargos (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.cargos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 58028)
-- Name: cargos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cargos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cargos_id_seq OWNER TO postgres;

--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 225
-- Name: cargos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cargos_id_seq OWNED BY public.cargos.id;


--
-- TOC entry 224 (class 1259 OID 58020)
-- Name: carreras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carreras (
    id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.carreras OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 58019)
-- Name: carreras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carreras_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carreras_id_seq OWNER TO postgres;

--
-- TOC entry 5339 (class 0 OID 0)
-- Dependencies: 223
-- Name: carreras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carreras_id_seq OWNED BY public.carreras.id;


--
-- TOC entry 277 (class 1259 OID 58493)
-- Name: certificados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificados (
    id bigint NOT NULL,
    alumno_id bigint NOT NULL,
    curso_id bigint,
    es_interno boolean DEFAULT false NOT NULL,
    plataforma character varying(100),
    fecha_emision date,
    imagen_certificado text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.certificados OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 58492)
-- Name: certificados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificados_id_seq OWNER TO postgres;

--
-- TOC entry 5340 (class 0 OID 0)
-- Dependencies: 276
-- Name: certificados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificados_id_seq OWNED BY public.certificados.id;


--
-- TOC entry 263 (class 1259 OID 58279)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id bigint NOT NULL,
    usuario_id bigint NOT NULL,
    nombre_empresa character varying(150) NOT NULL,
    contacto_principal character varying(150),
    industria character varying(100),
    telefono character varying(20),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 58278)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 5341 (class 0 OID 0)
-- Dependencies: 262
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 265 (class 1259 OID 58294)
-- Name: contratos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contratos (
    id bigint NOT NULL,
    cliente_id bigint NOT NULL,
    servicio_id bigint NOT NULL,
    estado_contrato_id bigint NOT NULL,
    fecha_firma date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.contratos OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 58293)
-- Name: contratos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contratos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contratos_id_seq OWNER TO postgres;

--
-- TOC entry 5342 (class 0 OID 0)
-- Dependencies: 264
-- Name: contratos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contratos_id_seq OWNED BY public.contratos.id;


--
-- TOC entry 253 (class 1259 OID 58165)
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    fecha_inicio date,
    fecha_terminacion date,
    descripcion text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 58110)
-- Name: estados_contrato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados_contrato (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.estados_contrato OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 58109)
-- Name: estados_contrato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estados_contrato_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estados_contrato_id_seq OWNER TO postgres;

--
-- TOC entry 5343 (class 0 OID 0)
-- Dependencies: 243
-- Name: estados_contrato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estados_contrato_id_seq OWNED BY public.estados_contrato.id;


--
-- TOC entry 236 (class 1259 OID 58074)
-- Name: estados_curso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados_curso (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.estados_curso OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 58073)
-- Name: estados_curso_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estados_curso_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estados_curso_id_seq OWNER TO postgres;

--
-- TOC entry 5344 (class 0 OID 0)
-- Dependencies: 235
-- Name: estados_curso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estados_curso_id_seq OWNED BY public.estados_curso.id;


--
-- TOC entry 284 (class 1259 OID 58579)
-- Name: evaluaciones_actitud; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluaciones_actitud (
    id bigint NOT NULL,
    evaluacion_curso_id bigint NOT NULL,
    responsabilidad integer,
    etica_respeto integer,
    proactividad integer,
    adaptabilidad integer,
    colaboracion integer,
    total_puntos_actitud integer,
    comentarios_actitud text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.evaluaciones_actitud OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 58578)
-- Name: evaluaciones_actitud_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluaciones_actitud_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluaciones_actitud_id_seq OWNER TO postgres;

--
-- TOC entry 5345 (class 0 OID 0)
-- Dependencies: 283
-- Name: evaluaciones_actitud_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluaciones_actitud_id_seq OWNED BY public.evaluaciones_actitud.id;


--
-- TOC entry 279 (class 1259 OID 58516)
-- Name: evaluaciones_cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluaciones_cursos (
    id bigint NOT NULL,
    alumno_id bigint NOT NULL,
    curso_id bigint NOT NULL,
    dominio_conceptos integer,
    resolucion_problemas integer,
    uso_herramientas integer,
    autonomia_tecnica integer,
    aplicacion_practica integer,
    total_puntos integer,
    nivel integer,
    comentarios text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.evaluaciones_cursos OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 58515)
-- Name: evaluaciones_cursos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluaciones_cursos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluaciones_cursos_id_seq OWNER TO postgres;

--
-- TOC entry 5346 (class 0 OID 0)
-- Dependencies: 278
-- Name: evaluaciones_cursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluaciones_cursos_id_seq OWNED BY public.evaluaciones_cursos.id;


--
-- TOC entry 255 (class 1259 OID 58191)
-- Name: eventos_internos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos_internos (
    id bigint NOT NULL,
    tipo_evento_id bigint NOT NULL,
    plataforma_id bigint NOT NULL,
    nombre_evento character varying(150),
    fecha_evento timestamp(0) without time zone,
    descripcion text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.eventos_internos OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 58056)
-- Name: habilidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habilidades (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.habilidades OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 58055)
-- Name: habilidades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habilidades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habilidades_id_seq OWNER TO postgres;

--
-- TOC entry 5347 (class 0 OID 0)
-- Dependencies: 231
-- Name: habilidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habilidades_id_seq OWNED BY public.habilidades.id;


--
-- TOC entry 282 (class 1259 OID 58557)
-- Name: historial_niveles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_niveles (
    id bigint NOT NULL,
    alumno_habilidad_id bigint NOT NULL,
    nivel_habilidad_id bigint NOT NULL,
    fecha_cambio date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.historial_niveles OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 58556)
-- Name: historial_niveles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_niveles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_niveles_id_seq OWNER TO postgres;

--
-- TOC entry 5348 (class 0 OID 0)
-- Dependencies: 281
-- Name: historial_niveles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_niveles_id_seq OWNED BY public.historial_niveles.id;


--
-- TOC entry 288 (class 1259 OID 58625)
-- Name: incidentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incidentes (
    id bigint NOT NULL,
    proyecto_auditoria_id bigint NOT NULL,
    tipo_incidente character varying(150),
    impacto text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.incidentes OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 58624)
-- Name: incidentes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.incidentes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.incidentes_id_seq OWNER TO postgres;

--
-- TOC entry 5349 (class 0 OID 0)
-- Dependencies: 287
-- Name: incidentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.incidentes_id_seq OWNED BY public.incidentes.id;


--
-- TOC entry 220 (class 1259 OID 58001)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 58000)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- TOC entry 5350 (class 0 OID 0)
-- Dependencies: 219
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 248 (class 1259 OID 58130)
-- Name: niveles_habilidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.niveles_habilidad (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.niveles_habilidad OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 58129)
-- Name: niveles_habilidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.niveles_habilidad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.niveles_habilidad_id_seq OWNER TO postgres;

--
-- TOC entry 5351 (class 0 OID 0)
-- Dependencies: 247
-- Name: niveles_habilidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.niveles_habilidad_id_seq OWNED BY public.niveles_habilidad.id;


--
-- TOC entry 257 (class 1259 OID 58217)
-- Name: patrocinadores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patrocinadores (
    id bigint NOT NULL,
    tipo_entidad_id bigint NOT NULL,
    nombre_patrocinador character varying(150) NOT NULL,
    calle character varying(150),
    numero_exterior integer,
    colonia character varying(150),
    codigo_postal integer,
    numero_interior integer,
    telefono character varying(20),
    correo character varying(150),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.patrocinadores OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 58216)
-- Name: patrocinadores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patrocinadores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patrocinadores_id_seq OWNER TO postgres;

--
-- TOC entry 5352 (class 0 OID 0)
-- Dependencies: 256
-- Name: patrocinadores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patrocinadores_id_seq OWNED BY public.patrocinadores.id;


--
-- TOC entry 240 (class 1259 OID 58092)
-- Name: plataformas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plataformas (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.plataformas OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 58091)
-- Name: plataformas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plataformas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plataformas_id_seq OWNER TO postgres;

--
-- TOC entry 5353 (class 0 OID 0)
-- Dependencies: 239
-- Name: plataformas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plataformas_id_seq OWNED BY public.plataformas.id;


--
-- TOC entry 275 (class 1259 OID 58473)
-- Name: proyecto_patrocinador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyecto_patrocinador (
    proyecto_id bigint NOT NULL,
    patrocinador_id bigint NOT NULL,
    descripcion_ayuda text,
    fecha_patrocinio date,
    monto_estimado numeric(12,2)
);


ALTER TABLE public.proyecto_patrocinador OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 58179)
-- Name: proyectos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos (
    id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    inicio date,
    fin date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.proyectos OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 58537)
-- Name: proyectos_auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyectos_auditoria (
    id bigint NOT NULL,
    contrato_id bigint NOT NULL,
    alcance text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.proyectos_auditoria OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 58065)
-- Name: roles_proyecto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_proyecto (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.roles_proyecto OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 58064)
-- Name: roles_proyecto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_proyecto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_proyecto_id_seq OWNER TO postgres;

--
-- TOC entry 5354 (class 0 OID 0)
-- Dependencies: 233
-- Name: roles_proyecto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_proyecto_id_seq OWNED BY public.roles_proyecto.id;


--
-- TOC entry 222 (class 1259 OID 58011)
-- Name: roles_usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_usuario (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.roles_usuario OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 58010)
-- Name: roles_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5355 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_usuario_id_seq OWNED BY public.roles_usuario.id;


--
-- TOC entry 228 (class 1259 OID 58038)
-- Name: salidas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salidas (
    id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    fecha date,
    hora time(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.salidas OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 58037)
-- Name: salidas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salidas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salidas_id_seq OWNER TO postgres;

--
-- TOC entry 5356 (class 0 OID 0)
-- Dependencies: 227
-- Name: salidas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salidas_id_seq OWNED BY public.salidas.id;


--
-- TOC entry 246 (class 1259 OID 58119)
-- Name: servicios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servicios (
    id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.servicios OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 58118)
-- Name: servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servicios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servicios_id_seq OWNER TO postgres;

--
-- TOC entry 5357 (class 0 OID 0)
-- Dependencies: 245
-- Name: servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servicios_id_seq OWNED BY public.servicios.id;


--
-- TOC entry 242 (class 1259 OID 58101)
-- Name: severidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.severidades (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.severidades OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 58100)
-- Name: severidades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.severidades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.severidades_id_seq OWNER TO postgres;

--
-- TOC entry 5358 (class 0 OID 0)
-- Dependencies: 241
-- Name: severidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.severidades_id_seq OWNED BY public.severidades.id;


--
-- TOC entry 230 (class 1259 OID 58047)
-- Name: tipos_entidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_entidad (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.tipos_entidad OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 58046)
-- Name: tipos_entidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_entidad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_entidad_id_seq OWNER TO postgres;

--
-- TOC entry 5359 (class 0 OID 0)
-- Dependencies: 229
-- Name: tipos_entidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_entidad_id_seq OWNED BY public.tipos_entidad.id;


--
-- TOC entry 238 (class 1259 OID 58083)
-- Name: tipos_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_evento (
    id bigint NOT NULL,
    nombre character varying(50) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.tipos_evento OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 58082)
-- Name: tipos_evento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_evento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_evento_id_seq OWNER TO postgres;

--
-- TOC entry 5360 (class 0 OID 0)
-- Dependencies: 237
-- Name: tipos_evento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_evento_id_seq OWNED BY public.tipos_evento.id;


--
-- TOC entry 272 (class 1259 OID 58428)
-- Name: tutor_actividad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutor_actividad (
    tutor_id bigint NOT NULL,
    actividad_id bigint NOT NULL,
    rol character varying(50)
);


ALTER TABLE public.tutor_actividad OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 58262)
-- Name: tutores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutores (
    id bigint NOT NULL,
    usuario_id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    ap_paterno character varying(150),
    ap_materno character varying(150),
    telefono character varying(20),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.tutores OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 58261)
-- Name: tutores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tutores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tutores_id_seq OWNER TO postgres;

--
-- TOC entry 5361 (class 0 OID 0)
-- Dependencies: 260
-- Name: tutores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tutores_id_seq OWNED BY public.tutores.id;


--
-- TOC entry 252 (class 1259 OID 58148)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    rol_usuario_id bigint NOT NULL,
    correo character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 58147)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5362 (class 0 OID 0)
-- Dependencies: 251
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 286 (class 1259 OID 58595)
-- Name: vulnerabilidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vulnerabilidades (
    id bigint NOT NULL,
    proyecto_auditoria_id bigint NOT NULL,
    alumno_id bigint,
    severidad_id bigint NOT NULL,
    titulo character varying(200) NOT NULL,
    estado character varying(50) DEFAULT 'Abierta'::character varying NOT NULL,
    evidencia text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


ALTER TABLE public.vulnerabilidades OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 58594)
-- Name: vulnerabilidades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vulnerabilidades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vulnerabilidades_id_seq OWNER TO postgres;

--
-- TOC entry 5363 (class 0 OID 0)
-- Dependencies: 285
-- Name: vulnerabilidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vulnerabilidades_id_seq OWNED BY public.vulnerabilidades.id;


--
-- TOC entry 4955 (class 2604 OID 58142)
-- Name: actividades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades ALTER COLUMN id SET DEFAULT nextval('public.actividades_id_seq'::regclass);


--
-- TOC entry 4966 (class 2604 OID 58408)
-- Name: alumno_evento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_evento ALTER COLUMN id SET DEFAULT nextval('public.alumno_evento_id_seq'::regclass);


--
-- TOC entry 4968 (class 2604 OID 58449)
-- Name: alumno_habilidades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_habilidades ALTER COLUMN id SET DEFAULT nextval('public.alumno_habilidades_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 58237)
-- Name: alumnos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos ALTER COLUMN id SET DEFAULT nextval('public.alumnos_id_seq'::regclass);


--
-- TOC entry 4943 (class 2604 OID 58032)
-- Name: cargos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargos ALTER COLUMN id SET DEFAULT nextval('public.cargos_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 58023)
-- Name: carreras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras ALTER COLUMN id SET DEFAULT nextval('public.carreras_id_seq'::regclass);


--
-- TOC entry 4969 (class 2604 OID 58496)
-- Name: certificados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificados ALTER COLUMN id SET DEFAULT nextval('public.certificados_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 58282)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 58297)
-- Name: contratos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contratos ALTER COLUMN id SET DEFAULT nextval('public.contratos_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 58113)
-- Name: estados_contrato id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_contrato ALTER COLUMN id SET DEFAULT nextval('public.estados_contrato_id_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 58077)
-- Name: estados_curso id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_curso ALTER COLUMN id SET DEFAULT nextval('public.estados_curso_id_seq'::regclass);


--
-- TOC entry 4974 (class 2604 OID 58582)
-- Name: evaluaciones_actitud id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_actitud ALTER COLUMN id SET DEFAULT nextval('public.evaluaciones_actitud_id_seq'::regclass);


--
-- TOC entry 4971 (class 2604 OID 58519)
-- Name: evaluaciones_cursos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_cursos ALTER COLUMN id SET DEFAULT nextval('public.evaluaciones_cursos_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 58059)
-- Name: habilidades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades ALTER COLUMN id SET DEFAULT nextval('public.habilidades_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 58560)
-- Name: historial_niveles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_niveles ALTER COLUMN id SET DEFAULT nextval('public.historial_niveles_id_seq'::regclass);


--
-- TOC entry 4977 (class 2604 OID 58628)
-- Name: incidentes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes ALTER COLUMN id SET DEFAULT nextval('public.incidentes_id_seq'::regclass);


--
-- TOC entry 4940 (class 2604 OID 58004)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 4954 (class 2604 OID 58133)
-- Name: niveles_habilidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveles_habilidad ALTER COLUMN id SET DEFAULT nextval('public.niveles_habilidad_id_seq'::regclass);


--
-- TOC entry 4957 (class 2604 OID 58220)
-- Name: patrocinadores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrocinadores ALTER COLUMN id SET DEFAULT nextval('public.patrocinadores_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 58095)
-- Name: plataformas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataformas ALTER COLUMN id SET DEFAULT nextval('public.plataformas_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 58068)
-- Name: roles_proyecto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_proyecto ALTER COLUMN id SET DEFAULT nextval('public.roles_proyecto_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 58014)
-- Name: roles_usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_usuario ALTER COLUMN id SET DEFAULT nextval('public.roles_usuario_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 58041)
-- Name: salidas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salidas ALTER COLUMN id SET DEFAULT nextval('public.salidas_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 58122)
-- Name: servicios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios ALTER COLUMN id SET DEFAULT nextval('public.servicios_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 58104)
-- Name: severidades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.severidades ALTER COLUMN id SET DEFAULT nextval('public.severidades_id_seq'::regclass);


--
-- TOC entry 4945 (class 2604 OID 58050)
-- Name: tipos_entidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_entidad ALTER COLUMN id SET DEFAULT nextval('public.tipos_entidad_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 58086)
-- Name: tipos_evento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_evento ALTER COLUMN id SET DEFAULT nextval('public.tipos_evento_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 58265)
-- Name: tutores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutores ALTER COLUMN id SET DEFAULT nextval('public.tutores_id_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 58151)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4975 (class 2604 OID 58598)
-- Name: vulnerabilidades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerabilidades ALTER COLUMN id SET DEFAULT nextval('public.vulnerabilidades_id_seq'::regclass);


--
-- TOC entry 5288 (class 0 OID 58139)
-- Dependencies: 250
-- Data for Name: actividades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actividades (id, tipo_actividad, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5304 (class 0 OID 58319)
-- Dependencies: 266
-- Data for Name: alumno_cargo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumno_cargo (alumno_id, cargo_id) FROM stdin;
\.


--
-- TOC entry 5305 (class 0 OID 58336)
-- Dependencies: 267
-- Data for Name: alumno_curso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumno_curso (alumno_id, curso_id, estado_curso_id, fecha_inscripcion, calificacion) FROM stdin;
\.


--
-- TOC entry 5309 (class 0 OID 58405)
-- Dependencies: 271
-- Data for Name: alumno_evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumno_evento (id, evento_interno_id, alumno_id, comentarios, puntos_ganados, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5312 (class 0 OID 58446)
-- Dependencies: 274
-- Data for Name: alumno_habilidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumno_habilidades (id, alumno_id, habilidad_id, fecha_inicio, nivel_habilidad_id, descripcion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5306 (class 0 OID 58361)
-- Dependencies: 268
-- Data for Name: alumno_proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumno_proyecto (alumno_id, proyecto_id, rol_proyecto_id, fecha_ingreso) FROM stdin;
\.


--
-- TOC entry 5307 (class 0 OID 58386)
-- Dependencies: 269
-- Data for Name: alumno_salida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumno_salida (alumno_id, salida_id, estado_asistencia) FROM stdin;
\.


--
-- TOC entry 5297 (class 0 OID 58234)
-- Dependencies: 259
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumnos (id, usuario_id, matricula, nombre, ap_paterno, ap_materno, carrera_id, ciclo, fecha_nacimiento, activo, foto_perfil, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5264 (class 0 OID 58029)
-- Dependencies: 226
-- Data for Name: cargos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cargos (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5262 (class 0 OID 58020)
-- Dependencies: 224
-- Data for Name: carreras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carreras (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5315 (class 0 OID 58493)
-- Dependencies: 277
-- Data for Name: certificados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificados (id, alumno_id, curso_id, es_interno, plataforma, fecha_emision, imagen_certificado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5301 (class 0 OID 58279)
-- Dependencies: 263
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, usuario_id, nombre_empresa, contacto_principal, industria, telefono, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5303 (class 0 OID 58294)
-- Dependencies: 265
-- Data for Name: contratos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contratos (id, cliente_id, servicio_id, estado_contrato_id, fecha_firma, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5291 (class 0 OID 58165)
-- Dependencies: 253
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id, nombre, fecha_inicio, fecha_terminacion, descripcion, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5282 (class 0 OID 58110)
-- Dependencies: 244
-- Data for Name: estados_contrato; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estados_contrato (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5274 (class 0 OID 58074)
-- Dependencies: 236
-- Data for Name: estados_curso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estados_curso (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5322 (class 0 OID 58579)
-- Dependencies: 284
-- Data for Name: evaluaciones_actitud; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluaciones_actitud (id, evaluacion_curso_id, responsabilidad, etica_respeto, proactividad, adaptabilidad, colaboracion, total_puntos_actitud, comentarios_actitud, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5317 (class 0 OID 58516)
-- Dependencies: 279
-- Data for Name: evaluaciones_cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluaciones_cursos (id, alumno_id, curso_id, dominio_conceptos, resolucion_problemas, uso_herramientas, autonomia_tecnica, aplicacion_practica, total_puntos, nivel, comentarios, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5293 (class 0 OID 58191)
-- Dependencies: 255
-- Data for Name: eventos_internos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos_internos (id, tipo_evento_id, plataforma_id, nombre_evento, fecha_evento, descripcion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5270 (class 0 OID 58056)
-- Dependencies: 232
-- Data for Name: habilidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.habilidades (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5320 (class 0 OID 58557)
-- Dependencies: 282
-- Data for Name: historial_niveles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_niveles (id, alumno_habilidad_id, nivel_habilidad_id, fecha_cambio, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5326 (class 0 OID 58625)
-- Dependencies: 288
-- Data for Name: incidentes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incidentes (id, proyecto_auditoria_id, tipo_incidente, impacto, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5258 (class 0 OID 58001)
-- Dependencies: 220
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	2026_03_19_043832_create_roles_usuario_table	1
2	2026_03_19_043909_create_carreras_table	1
3	2026_03_19_043919_create_cargos_table	1
4	2026_03_19_043928_create_salidas_table	1
5	2026_03_19_043938_create_tipos_entidad_table	1
6	2026_03_19_043948_create_habilidades_table	1
7	2026_03_19_044002_create_roles_proyecto_table	1
8	2026_03_19_044032_create_estados_curso_table	1
9	2026_03_19_044043_create_tipos_evento_table	1
10	2026_03_19_044055_create_plataformas_table	1
11	2026_03_19_044103_create_severidades_table	1
12	2026_03_19_044113_create_estados_contrato_table	1
13	2026_03_19_044120_create_servicios_table	1
14	2026_03_19_044131_create_niveles_habilidad_table	1
15	2026_03_19_044146_create_actividades_table	1
16	2026_03_19_044156_create_usuarios_table	1
17	2026_03_19_044204_create_cursos_table	1
18	2026_03_19_044219_create_proyectos_table	1
19	2026_03_19_044229_create_eventos_internos_table	1
20	2026_03_19_044237_create_patrocinadores_table	1
21	2026_03_19_044245_create_alumnos_table	1
22	2026_03_19_044253_create_tutores_table	1
23	2026_03_19_044302_create_clientes_table	1
24	2026_03_19_044413_create_contratos_table	1
25	2026_03_19_044422_create_alumno_cargo_table	1
26	2026_03_19_044429_create_alumno_curso_table	1
27	2026_03_19_044441_create_alumno_proyecto_table	1
28	2026_03_19_044447_create_alumno_salida_table	1
29	2026_03_19_044455_create_alumno_evento_table	1
30	2026_03_19_044503_create_tutor_actividad_table	1
31	2026_03_19_044511_create_alumno_habilidades_table	1
32	2026_03_19_044519_create_proyecto_patrocinador_table	1
33	2026_03_19_044527_create_certificados_table	1
34	2026_03_19_044535_create_evaluaciones_cursos_table	1
35	2026_03_19_044544_create_proyectos_auditoria_table	1
36	2026_03_19_044551_create_historial_niveles_table	1
37	2026_03_19_044558_create_evaluaciones_actitud_table	1
38	2026_03_19_044607_create_vulnerabilidades_table	1
39	2026_03_19_044613_create_incidentes_table	1
\.


--
-- TOC entry 5286 (class 0 OID 58130)
-- Dependencies: 248
-- Data for Name: niveles_habilidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.niveles_habilidad (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5295 (class 0 OID 58217)
-- Dependencies: 257
-- Data for Name: patrocinadores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patrocinadores (id, tipo_entidad_id, nombre_patrocinador, calle, numero_exterior, colonia, codigo_postal, numero_interior, telefono, correo, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5278 (class 0 OID 58092)
-- Dependencies: 240
-- Data for Name: plataformas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plataformas (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5313 (class 0 OID 58473)
-- Dependencies: 275
-- Data for Name: proyecto_patrocinador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyecto_patrocinador (proyecto_id, patrocinador_id, descripcion_ayuda, fecha_patrocinio, monto_estimado) FROM stdin;
\.


--
-- TOC entry 5292 (class 0 OID 58179)
-- Dependencies: 254
-- Data for Name: proyectos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyectos (id, nombre, inicio, fin, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5318 (class 0 OID 58537)
-- Dependencies: 280
-- Data for Name: proyectos_auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proyectos_auditoria (id, contrato_id, alcance, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5272 (class 0 OID 58065)
-- Dependencies: 234
-- Data for Name: roles_proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_proyecto (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5260 (class 0 OID 58011)
-- Dependencies: 222
-- Data for Name: roles_usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_usuario (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5266 (class 0 OID 58038)
-- Dependencies: 228
-- Data for Name: salidas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salidas (id, nombre, fecha, hora, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5284 (class 0 OID 58119)
-- Dependencies: 246
-- Data for Name: servicios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.servicios (id, nombre, descripcion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5280 (class 0 OID 58101)
-- Dependencies: 242
-- Data for Name: severidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.severidades (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5268 (class 0 OID 58047)
-- Dependencies: 230
-- Data for Name: tipos_entidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_entidad (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5276 (class 0 OID 58083)
-- Dependencies: 238
-- Data for Name: tipos_evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_evento (id, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5310 (class 0 OID 58428)
-- Dependencies: 272
-- Data for Name: tutor_actividad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tutor_actividad (tutor_id, actividad_id, rol) FROM stdin;
\.


--
-- TOC entry 5299 (class 0 OID 58262)
-- Dependencies: 261
-- Data for Name: tutores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tutores (id, usuario_id, nombre, ap_paterno, ap_materno, telefono, activo, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5290 (class 0 OID 58148)
-- Dependencies: 252
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, rol_usuario_id, correo, password, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5324 (class 0 OID 58595)
-- Dependencies: 286
-- Data for Name: vulnerabilidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vulnerabilidades (id, proyecto_auditoria_id, alumno_id, severidad_id, titulo, estado, evidencia, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5364 (class 0 OID 0)
-- Dependencies: 249
-- Name: actividades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.actividades_id_seq', 1, false);


--
-- TOC entry 5365 (class 0 OID 0)
-- Dependencies: 270
-- Name: alumno_evento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumno_evento_id_seq', 1, false);


--
-- TOC entry 5366 (class 0 OID 0)
-- Dependencies: 273
-- Name: alumno_habilidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumno_habilidades_id_seq', 1, false);


--
-- TOC entry 5367 (class 0 OID 0)
-- Dependencies: 258
-- Name: alumnos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumnos_id_seq', 1, false);


--
-- TOC entry 5368 (class 0 OID 0)
-- Dependencies: 225
-- Name: cargos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cargos_id_seq', 1, false);


--
-- TOC entry 5369 (class 0 OID 0)
-- Dependencies: 223
-- Name: carreras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carreras_id_seq', 1, false);


--
-- TOC entry 5370 (class 0 OID 0)
-- Dependencies: 276
-- Name: certificados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificados_id_seq', 1, false);


--
-- TOC entry 5371 (class 0 OID 0)
-- Dependencies: 262
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 1, false);


--
-- TOC entry 5372 (class 0 OID 0)
-- Dependencies: 264
-- Name: contratos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contratos_id_seq', 1, false);


--
-- TOC entry 5373 (class 0 OID 0)
-- Dependencies: 243
-- Name: estados_contrato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estados_contrato_id_seq', 1, false);


--
-- TOC entry 5374 (class 0 OID 0)
-- Dependencies: 235
-- Name: estados_curso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estados_curso_id_seq', 1, false);


--
-- TOC entry 5375 (class 0 OID 0)
-- Dependencies: 283
-- Name: evaluaciones_actitud_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluaciones_actitud_id_seq', 1, false);


--
-- TOC entry 5376 (class 0 OID 0)
-- Dependencies: 278
-- Name: evaluaciones_cursos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluaciones_cursos_id_seq', 1, false);


--
-- TOC entry 5377 (class 0 OID 0)
-- Dependencies: 231
-- Name: habilidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habilidades_id_seq', 1, false);


--
-- TOC entry 5378 (class 0 OID 0)
-- Dependencies: 281
-- Name: historial_niveles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_niveles_id_seq', 1, false);


--
-- TOC entry 5379 (class 0 OID 0)
-- Dependencies: 287
-- Name: incidentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.incidentes_id_seq', 1, false);


--
-- TOC entry 5380 (class 0 OID 0)
-- Dependencies: 219
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 39, true);


--
-- TOC entry 5381 (class 0 OID 0)
-- Dependencies: 247
-- Name: niveles_habilidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.niveles_habilidad_id_seq', 1, false);


--
-- TOC entry 5382 (class 0 OID 0)
-- Dependencies: 256
-- Name: patrocinadores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patrocinadores_id_seq', 1, false);


--
-- TOC entry 5383 (class 0 OID 0)
-- Dependencies: 239
-- Name: plataformas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plataformas_id_seq', 1, false);


--
-- TOC entry 5384 (class 0 OID 0)
-- Dependencies: 233
-- Name: roles_proyecto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_proyecto_id_seq', 1, false);


--
-- TOC entry 5385 (class 0 OID 0)
-- Dependencies: 221
-- Name: roles_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_usuario_id_seq', 1, false);


--
-- TOC entry 5386 (class 0 OID 0)
-- Dependencies: 227
-- Name: salidas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salidas_id_seq', 1, false);


--
-- TOC entry 5387 (class 0 OID 0)
-- Dependencies: 245
-- Name: servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.servicios_id_seq', 1, false);


--
-- TOC entry 5388 (class 0 OID 0)
-- Dependencies: 241
-- Name: severidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.severidades_id_seq', 1, false);


--
-- TOC entry 5389 (class 0 OID 0)
-- Dependencies: 229
-- Name: tipos_entidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_entidad_id_seq', 1, false);


--
-- TOC entry 5390 (class 0 OID 0)
-- Dependencies: 237
-- Name: tipos_evento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_evento_id_seq', 1, false);


--
-- TOC entry 5391 (class 0 OID 0)
-- Dependencies: 260
-- Name: tutores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tutores_id_seq', 1, false);


--
-- TOC entry 5392 (class 0 OID 0)
-- Dependencies: 251
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- TOC entry 5393 (class 0 OID 0)
-- Dependencies: 285
-- Name: vulnerabilidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vulnerabilidades_id_seq', 1, false);


--
-- TOC entry 5011 (class 2606 OID 58146)
-- Name: actividades actividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actividades
    ADD CONSTRAINT actividades_pkey PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 58335)
-- Name: alumno_cargo alumno_cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_cargo
    ADD CONSTRAINT alumno_cargo_pkey PRIMARY KEY (alumno_id, cargo_id);


--
-- TOC entry 5037 (class 2606 OID 58360)
-- Name: alumno_curso alumno_curso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_curso
    ADD CONSTRAINT alumno_curso_pkey PRIMARY KEY (alumno_id, curso_id);


--
-- TOC entry 5043 (class 2606 OID 58417)
-- Name: alumno_evento alumno_evento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_evento
    ADD CONSTRAINT alumno_evento_pkey PRIMARY KEY (id);


--
-- TOC entry 5047 (class 2606 OID 58457)
-- Name: alumno_habilidades alumno_habilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_habilidades
    ADD CONSTRAINT alumno_habilidades_pkey PRIMARY KEY (id);


--
-- TOC entry 5039 (class 2606 OID 58385)
-- Name: alumno_proyecto alumno_proyecto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_proyecto
    ADD CONSTRAINT alumno_proyecto_pkey PRIMARY KEY (alumno_id, proyecto_id);


--
-- TOC entry 5041 (class 2606 OID 58403)
-- Name: alumno_salida alumno_salida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_salida
    ADD CONSTRAINT alumno_salida_pkey PRIMARY KEY (alumno_id, salida_id);


--
-- TOC entry 5025 (class 2606 OID 58260)
-- Name: alumnos alumnos_matricula_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_matricula_unique UNIQUE (matricula);


--
-- TOC entry 5027 (class 2606 OID 58248)
-- Name: alumnos alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 58036)
-- Name: cargos cargos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cargos
    ADD CONSTRAINT cargos_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 58027)
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (id);


--
-- TOC entry 5051 (class 2606 OID 58504)
-- Name: certificados certificados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificados
    ADD CONSTRAINT certificados_pkey PRIMARY KEY (id);


--
-- TOC entry 5031 (class 2606 OID 58287)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 58303)
-- Name: contratos contratos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 58178)
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 58117)
-- Name: estados_contrato estados_contrato_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_contrato
    ADD CONSTRAINT estados_contrato_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 58081)
-- Name: estados_curso estados_curso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_curso
    ADD CONSTRAINT estados_curso_pkey PRIMARY KEY (id);


--
-- TOC entry 5059 (class 2606 OID 58588)
-- Name: evaluaciones_actitud evaluaciones_actitud_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_actitud
    ADD CONSTRAINT evaluaciones_actitud_pkey PRIMARY KEY (id);


--
-- TOC entry 5053 (class 2606 OID 58526)
-- Name: evaluaciones_cursos evaluaciones_cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_cursos
    ADD CONSTRAINT evaluaciones_cursos_pkey PRIMARY KEY (id);


--
-- TOC entry 5021 (class 2606 OID 58215)
-- Name: eventos_internos eventos_internos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos_internos
    ADD CONSTRAINT eventos_internos_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 58063)
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_pkey PRIMARY KEY (id);


--
-- TOC entry 5057 (class 2606 OID 58567)
-- Name: historial_niveles historial_niveles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_niveles
    ADD CONSTRAINT historial_niveles_pkey PRIMARY KEY (id);


--
-- TOC entry 5063 (class 2606 OID 58634)
-- Name: incidentes incidentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT incidentes_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 58009)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5009 (class 2606 OID 58137)
-- Name: niveles_habilidad niveles_habilidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.niveles_habilidad
    ADD CONSTRAINT niveles_habilidad_pkey PRIMARY KEY (id);


--
-- TOC entry 5023 (class 2606 OID 58227)
-- Name: patrocinadores patrocinadores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrocinadores
    ADD CONSTRAINT patrocinadores_pkey PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 58099)
-- Name: plataformas plataformas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plataformas
    ADD CONSTRAINT plataformas_pkey PRIMARY KEY (id);


--
-- TOC entry 5049 (class 2606 OID 58491)
-- Name: proyecto_patrocinador proyecto_patrocinador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecto_patrocinador
    ADD CONSTRAINT proyecto_patrocinador_pkey PRIMARY KEY (proyecto_id, patrocinador_id);


--
-- TOC entry 5055 (class 2606 OID 58555)
-- Name: proyectos_auditoria proyectos_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos_auditoria
    ADD CONSTRAINT proyectos_auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 5019 (class 2606 OID 58190)
-- Name: proyectos proyectos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 58072)
-- Name: roles_proyecto roles_proyecto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_proyecto
    ADD CONSTRAINT roles_proyecto_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 58018)
-- Name: roles_usuario roles_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_usuario
    ADD CONSTRAINT roles_usuario_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 58045)
-- Name: salidas salidas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salidas
    ADD CONSTRAINT salidas_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 58128)
-- Name: servicios servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servicios
    ADD CONSTRAINT servicios_pkey PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 58108)
-- Name: severidades severidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.severidades
    ADD CONSTRAINT severidades_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 58054)
-- Name: tipos_entidad tipos_entidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_entidad
    ADD CONSTRAINT tipos_entidad_pkey PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 58090)
-- Name: tipos_evento tipos_evento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_evento
    ADD CONSTRAINT tipos_evento_pkey PRIMARY KEY (id);


--
-- TOC entry 5045 (class 2606 OID 58444)
-- Name: tutor_actividad tutor_actividad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor_actividad
    ADD CONSTRAINT tutor_actividad_pkey PRIMARY KEY (tutor_id, actividad_id);


--
-- TOC entry 5029 (class 2606 OID 58272)
-- Name: tutores tutores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutores
    ADD CONSTRAINT tutores_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 58164)
-- Name: usuarios usuarios_correo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_unique UNIQUE (correo);


--
-- TOC entry 5015 (class 2606 OID 58157)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5061 (class 2606 OID 58608)
-- Name: vulnerabilidades vulnerabilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerabilidades
    ADD CONSTRAINT vulnerabilidades_pkey PRIMARY KEY (id);


--
-- TOC entry 5078 (class 2606 OID 58324)
-- Name: alumno_cargo alumno_cargo_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_cargo
    ADD CONSTRAINT alumno_cargo_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5079 (class 2606 OID 58329)
-- Name: alumno_cargo alumno_cargo_cargo_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_cargo
    ADD CONSTRAINT alumno_cargo_cargo_id_foreign FOREIGN KEY (cargo_id) REFERENCES public.cargos(id) ON DELETE CASCADE;


--
-- TOC entry 5080 (class 2606 OID 58344)
-- Name: alumno_curso alumno_curso_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_curso
    ADD CONSTRAINT alumno_curso_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5081 (class 2606 OID 58349)
-- Name: alumno_curso alumno_curso_curso_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_curso
    ADD CONSTRAINT alumno_curso_curso_id_foreign FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON DELETE CASCADE;


--
-- TOC entry 5082 (class 2606 OID 58354)
-- Name: alumno_curso alumno_curso_estado_curso_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_curso
    ADD CONSTRAINT alumno_curso_estado_curso_id_foreign FOREIGN KEY (estado_curso_id) REFERENCES public.estados_curso(id) ON DELETE RESTRICT;


--
-- TOC entry 5088 (class 2606 OID 58423)
-- Name: alumno_evento alumno_evento_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_evento
    ADD CONSTRAINT alumno_evento_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5089 (class 2606 OID 58418)
-- Name: alumno_evento alumno_evento_evento_interno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_evento
    ADD CONSTRAINT alumno_evento_evento_interno_id_foreign FOREIGN KEY (evento_interno_id) REFERENCES public.eventos_internos(id) ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 58458)
-- Name: alumno_habilidades alumno_habilidades_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_habilidades
    ADD CONSTRAINT alumno_habilidades_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5093 (class 2606 OID 58463)
-- Name: alumno_habilidades alumno_habilidades_habilidad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_habilidades
    ADD CONSTRAINT alumno_habilidades_habilidad_id_foreign FOREIGN KEY (habilidad_id) REFERENCES public.habilidades(id) ON DELETE CASCADE;


--
-- TOC entry 5094 (class 2606 OID 58468)
-- Name: alumno_habilidades alumno_habilidades_nivel_habilidad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_habilidades
    ADD CONSTRAINT alumno_habilidades_nivel_habilidad_id_foreign FOREIGN KEY (nivel_habilidad_id) REFERENCES public.niveles_habilidad(id) ON DELETE RESTRICT;


--
-- TOC entry 5083 (class 2606 OID 58369)
-- Name: alumno_proyecto alumno_proyecto_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_proyecto
    ADD CONSTRAINT alumno_proyecto_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 58374)
-- Name: alumno_proyecto alumno_proyecto_proyecto_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_proyecto
    ADD CONSTRAINT alumno_proyecto_proyecto_id_foreign FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id) ON DELETE CASCADE;


--
-- TOC entry 5085 (class 2606 OID 58379)
-- Name: alumno_proyecto alumno_proyecto_rol_proyecto_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_proyecto
    ADD CONSTRAINT alumno_proyecto_rol_proyecto_id_foreign FOREIGN KEY (rol_proyecto_id) REFERENCES public.roles_proyecto(id) ON DELETE RESTRICT;


--
-- TOC entry 5086 (class 2606 OID 58392)
-- Name: alumno_salida alumno_salida_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_salida
    ADD CONSTRAINT alumno_salida_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5087 (class 2606 OID 58397)
-- Name: alumno_salida alumno_salida_salida_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumno_salida
    ADD CONSTRAINT alumno_salida_salida_id_foreign FOREIGN KEY (salida_id) REFERENCES public.salidas(id) ON DELETE CASCADE;


--
-- TOC entry 5071 (class 2606 OID 58254)
-- Name: alumnos alumnos_carrera_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_carrera_id_foreign FOREIGN KEY (carrera_id) REFERENCES public.carreras(id) ON DELETE SET NULL;


--
-- TOC entry 5072 (class 2606 OID 58249)
-- Name: alumnos alumnos_usuario_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_usuario_id_foreign FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5097 (class 2606 OID 58505)
-- Name: certificados certificados_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificados
    ADD CONSTRAINT certificados_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5098 (class 2606 OID 58510)
-- Name: certificados certificados_curso_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificados
    ADD CONSTRAINT certificados_curso_id_foreign FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON DELETE SET NULL;


--
-- TOC entry 5074 (class 2606 OID 58288)
-- Name: clientes clientes_usuario_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_usuario_id_foreign FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5075 (class 2606 OID 58304)
-- Name: contratos contratos_cliente_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_cliente_id_foreign FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 5076 (class 2606 OID 58314)
-- Name: contratos contratos_estado_contrato_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_estado_contrato_id_foreign FOREIGN KEY (estado_contrato_id) REFERENCES public.estados_contrato(id) ON DELETE RESTRICT;


--
-- TOC entry 5077 (class 2606 OID 58309)
-- Name: contratos contratos_servicio_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_servicio_id_foreign FOREIGN KEY (servicio_id) REFERENCES public.servicios(id) ON DELETE RESTRICT;


--
-- TOC entry 5065 (class 2606 OID 58172)
-- Name: cursos cursos_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_foreign FOREIGN KEY (id) REFERENCES public.actividades(id) ON DELETE CASCADE;


--
-- TOC entry 5105 (class 2606 OID 58589)
-- Name: evaluaciones_actitud evaluaciones_actitud_evaluacion_curso_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_actitud
    ADD CONSTRAINT evaluaciones_actitud_evaluacion_curso_id_foreign FOREIGN KEY (evaluacion_curso_id) REFERENCES public.evaluaciones_cursos(id) ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 58527)
-- Name: evaluaciones_cursos evaluaciones_cursos_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_cursos
    ADD CONSTRAINT evaluaciones_cursos_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE CASCADE;


--
-- TOC entry 5100 (class 2606 OID 58532)
-- Name: evaluaciones_cursos evaluaciones_cursos_curso_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_cursos
    ADD CONSTRAINT evaluaciones_cursos_curso_id_foreign FOREIGN KEY (curso_id) REFERENCES public.cursos(id) ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 58199)
-- Name: eventos_internos eventos_internos_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos_internos
    ADD CONSTRAINT eventos_internos_id_foreign FOREIGN KEY (id) REFERENCES public.actividades(id) ON DELETE CASCADE;


--
-- TOC entry 5068 (class 2606 OID 58209)
-- Name: eventos_internos eventos_internos_plataforma_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos_internos
    ADD CONSTRAINT eventos_internos_plataforma_id_foreign FOREIGN KEY (plataforma_id) REFERENCES public.plataformas(id) ON DELETE RESTRICT;


--
-- TOC entry 5069 (class 2606 OID 58204)
-- Name: eventos_internos eventos_internos_tipo_evento_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos_internos
    ADD CONSTRAINT eventos_internos_tipo_evento_id_foreign FOREIGN KEY (tipo_evento_id) REFERENCES public.tipos_evento(id) ON DELETE RESTRICT;


--
-- TOC entry 5103 (class 2606 OID 58568)
-- Name: historial_niveles historial_niveles_alumno_habilidad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_niveles
    ADD CONSTRAINT historial_niveles_alumno_habilidad_id_foreign FOREIGN KEY (alumno_habilidad_id) REFERENCES public.alumno_habilidades(id) ON DELETE CASCADE;


--
-- TOC entry 5104 (class 2606 OID 58573)
-- Name: historial_niveles historial_niveles_nivel_habilidad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_niveles
    ADD CONSTRAINT historial_niveles_nivel_habilidad_id_foreign FOREIGN KEY (nivel_habilidad_id) REFERENCES public.niveles_habilidad(id) ON DELETE RESTRICT;


--
-- TOC entry 5109 (class 2606 OID 58635)
-- Name: incidentes incidentes_proyecto_auditoria_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incidentes
    ADD CONSTRAINT incidentes_proyecto_auditoria_id_foreign FOREIGN KEY (proyecto_auditoria_id) REFERENCES public.proyectos_auditoria(id) ON DELETE CASCADE;


--
-- TOC entry 5070 (class 2606 OID 58228)
-- Name: patrocinadores patrocinadores_tipo_entidad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrocinadores
    ADD CONSTRAINT patrocinadores_tipo_entidad_id_foreign FOREIGN KEY (tipo_entidad_id) REFERENCES public.tipos_entidad(id) ON DELETE RESTRICT;


--
-- TOC entry 5095 (class 2606 OID 58485)
-- Name: proyecto_patrocinador proyecto_patrocinador_patrocinador_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecto_patrocinador
    ADD CONSTRAINT proyecto_patrocinador_patrocinador_id_foreign FOREIGN KEY (patrocinador_id) REFERENCES public.patrocinadores(id) ON DELETE CASCADE;


--
-- TOC entry 5096 (class 2606 OID 58480)
-- Name: proyecto_patrocinador proyecto_patrocinador_proyecto_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecto_patrocinador
    ADD CONSTRAINT proyecto_patrocinador_proyecto_id_foreign FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id) ON DELETE CASCADE;


--
-- TOC entry 5101 (class 2606 OID 58549)
-- Name: proyectos_auditoria proyectos_auditoria_contrato_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos_auditoria
    ADD CONSTRAINT proyectos_auditoria_contrato_id_foreign FOREIGN KEY (contrato_id) REFERENCES public.contratos(id) ON DELETE CASCADE;


--
-- TOC entry 5102 (class 2606 OID 58544)
-- Name: proyectos_auditoria proyectos_auditoria_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos_auditoria
    ADD CONSTRAINT proyectos_auditoria_id_foreign FOREIGN KEY (id) REFERENCES public.actividades(id) ON DELETE CASCADE;


--
-- TOC entry 5066 (class 2606 OID 58184)
-- Name: proyectos proyectos_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_id_foreign FOREIGN KEY (id) REFERENCES public.actividades(id) ON DELETE CASCADE;


--
-- TOC entry 5090 (class 2606 OID 58438)
-- Name: tutor_actividad tutor_actividad_actividad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor_actividad
    ADD CONSTRAINT tutor_actividad_actividad_id_foreign FOREIGN KEY (actividad_id) REFERENCES public.actividades(id) ON DELETE CASCADE;


--
-- TOC entry 5091 (class 2606 OID 58433)
-- Name: tutor_actividad tutor_actividad_tutor_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor_actividad
    ADD CONSTRAINT tutor_actividad_tutor_id_foreign FOREIGN KEY (tutor_id) REFERENCES public.tutores(id) ON DELETE CASCADE;


--
-- TOC entry 5073 (class 2606 OID 58273)
-- Name: tutores tutores_usuario_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutores
    ADD CONSTRAINT tutores_usuario_id_foreign FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5064 (class 2606 OID 58158)
-- Name: usuarios usuarios_rol_usuario_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_usuario_id_foreign FOREIGN KEY (rol_usuario_id) REFERENCES public.roles_usuario(id) ON DELETE RESTRICT;


--
-- TOC entry 5106 (class 2606 OID 58614)
-- Name: vulnerabilidades vulnerabilidades_alumno_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerabilidades
    ADD CONSTRAINT vulnerabilidades_alumno_id_foreign FOREIGN KEY (alumno_id) REFERENCES public.alumnos(id) ON DELETE SET NULL;


--
-- TOC entry 5107 (class 2606 OID 58609)
-- Name: vulnerabilidades vulnerabilidades_proyecto_auditoria_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerabilidades
    ADD CONSTRAINT vulnerabilidades_proyecto_auditoria_id_foreign FOREIGN KEY (proyecto_auditoria_id) REFERENCES public.proyectos_auditoria(id) ON DELETE CASCADE;


--
-- TOC entry 5108 (class 2606 OID 58619)
-- Name: vulnerabilidades vulnerabilidades_severidad_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vulnerabilidades
    ADD CONSTRAINT vulnerabilidades_severidad_id_foreign FOREIGN KEY (severidad_id) REFERENCES public.severidades(id) ON DELETE RESTRICT;


--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-05-03 22:21:38

--
-- PostgreSQL database dump complete
--

\unrestrict l9GT64lOQdr4HCbUaIbgGawKZ0T5ZfVJdfk0mWNR8YVOSkzUTHDIebS4NupcXdz

