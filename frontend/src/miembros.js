import api from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-miembros');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="animate-pulse space-y-8">
            <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div>
        </div>
    `;

    try {
        const respuesta = await api.get('/alumnos/miembros');
        const miembros = respuesta.data.datos || respuesta.data;

        contenedor.innerHTML = '';

        const departamentos = {
            "Coordinación": [],
            "Desarrollo Web": [],
            "Inteligencia Artificial": [],
            "Ciberseguridad": [],
            "Marketing": []
        };


        miembros.forEach(miembro => {
            const deptosDelUsuario = (miembro.departamentos && miembro.departamentos.length > 0) 
                ? miembro.departamentos
                : ["Desarrollo Web"];

            deptosDelUsuario.forEach(depto => {
                if (departamentos[depto]) {
                    departamentos[depto].push(miembro);
                }
            });
        });

        // Prevención XSS
        for (const [nombreDepto, listaMiembros] of Object.entries(departamentos)) {
            if (listaMiembros.length === 0) continue; // No mostrar departamentos vacíos

            // Contenedor del departamento
            const sectionDepto = document.createElement('div');
            sectionDepto.className = 'flex flex-col gap-6';
            sectionDepto.id = nombreDepto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

            const tituloDepto = document.createElement('h2');
            tituloDepto.className = 'text-3xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2';
            tituloDepto.textContent = nombreDepto;
            sectionDepto.appendChild(tituloDepto);

            const gridCards = document.createElement('div');
            gridCards.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

            listaMiembros.forEach(miembro => {
                const card = document.createElement('div');
                card.className = 'bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100 dark:border-gray-800 transition-transform hover:scale-105';

                // Avatar por defecto
                const avatar = document.createElement('img');
                avatar.src = miembro.foto_perfil || '/img/avatar.png'; // Asegúrate de usar la propiedad correcta de la BD
                avatar.alt = `Foto de ${miembro.nombre}`;
                avatar.className = 'w-16 h-16 rounded-full object-cover ring-2 ring-teal-500';

                avatar.onerror = function() {
                    this.onerror = null;
                    this.src = '/img/avatar.png';
                };

                const infoDiv = document.createElement('div');
                infoDiv.className = 'flex flex-col overflow-hidden';

                const nombre = document.createElement('h3');
                nombre.className = 'font-bold text-gray-900 dark:text-white truncate';
                nombre.textContent = `${miembro.nombre} ${miembro.ap_paterno || ''}`; // XSS Seguro

                const rol = document.createElement('span');
                rol.className = 'text-sm text-teal-600 dark:text-teal-400 font-medium truncate';
                rol.textContent = miembro.rol_especifico || 'Miembro OWLS'; // XSS Seguro

                infoDiv.appendChild(nombre);
                infoDiv.appendChild(rol);
                card.appendChild(avatar);
                card.appendChild(infoDiv);
                
                gridCards.appendChild(card);
            });

            sectionDepto.appendChild(gridCards);
            contenedor.appendChild(sectionDepto);
        }

        if (window.location.hash) {
            const destino = document.querySelector(window.location.hash);
            if (destino) destino.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error("Error al cargar miembros:", error);
        contenedor.innerHTML = `
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                Error al cargar la lista de miembros. Por favor, intenta más tarde.
            </div>
        `;
    }
});