import api from './api.js';
import { inicializarAfiliados, cargarDirectorio } from './admin-miembros.js';
import { CursosManager } from './cursos.js';
import { EventosManager } from './eventos.js';
import { ProyectosManager } from './proyectos.js';
import { NovedadesManager } from './admin-novedades.js';
import { InsigniasManager } from './admin-insignias.js';

let seccionActualVisible = 'dashboard';

const cursosManager = new CursosManager();
const eventosManager = new EventosManager();
const proyectosManager = new ProyectosManager();
const novedadesManager = new NovedadesManager();
const insigniasManager = new InsigniasManager();


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data: perfil } = await api.get('/perfil/me');
        
        if (!perfil || !perfil.roles.includes('Administrador')) {
            alert("Acceso denegado: Sin permisos de administrador.");
            window.location.replace("/perfil.html");
            return;
        }
        inicializarAfiliados();

        const botonDashboard = document.querySelector('.boton-menu[data-seccion="dashboard"]');
        mostrarSeccion('dashboard', botonDashboard);
    } catch (error) {
        console.warn("Redirigiendo a login: Sin sesión activa", error);
        window.location.replace("/login.html");
    }
});

document.querySelectorAll('.boton-menu[data-seccion]').forEach(boton => {
    boton.addEventListener('click', () => mostrarSeccion(boton.dataset.seccion, boton));
});

function ocultarTodasLasSecciones() {
    document.querySelectorAll('.seccion-admin').forEach(seccion => seccion.classList.add('oculta'));
    document.querySelectorAll('.boton-menu').forEach(boton => boton.classList.remove('activo'));
}

function mostrarSeccion(nombreDeLaSeccion, botonPresionado) {
    ocultarTodasLasSecciones();
    const seccionAMostrar = document.getElementById(nombreDeLaSeccion);
    
    if (seccionAMostrar) {
        seccionAMostrar.classList.remove('oculta');
        if (botonPresionado) botonPresionado.classList.add('activo');
        seccionActualVisible = nombreDeLaSeccion;
        cargarDatosDeLaSeccion(nombreDeLaSeccion);
    }
}

// Arquitectura unificada: Carga diferida (Lazy Loading) de todos los módulos
function cargarDatosDeLaSeccion(seccion) {
    switch(seccion) {
        case 'dashboard':
            const totalElement = document.getElementById('total-alumnos-activos');
            if(totalElement) totalElement.innerText = "0";
            break;
        case 'gestion-owls':
            cargarDirectorio();
            break;
	case 'gestion-proyectos':
            proyectosManager.fetchProyectos();
            break;
        case 'cursos-eventos':
            cursosManager.fetchCursos();
            break;
        case 'gestion-eventos':
            eventosManager.fetchEventos();
            break;
        case 'gestion-novedades':
            novedadesManager.fetchActividades();
            break;
        case 'gestion-insignias':
            insigniasManager.fetchInsignias();
            break;
    }
}