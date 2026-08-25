import api from './api.js';

let paginaActual = 1;
const limite = 50;

document.addEventListener('DOMContentLoaded', () => {
    cargarRanking();

    // Listeners de paginación
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                cargarRanking();
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            paginaActual++;
            cargarRanking();
        });
    }
});

async function cargarRanking() {
    const podiumSection = document.getElementById('podiumSection');
    const rankingsContainer = document.getElementById('rankingsContainer');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const pageInfo = document.getElementById('page-info');

    if (!podiumSection || !rankingsContainer) return;

    let isFetching = true;
    const loadingTimeout = setTimeout(() => {
        if (isFetching) {
            podiumSection.innerHTML = '<p class="text-center text-gray-500 w-full animate-pulse">Cargando ranking...</p>';
            rankingsContainer.innerHTML = '';
        }
    }, 300);

    try {
        const respuesta = await api.get(`/ranking?pagina=${paginaActual}&limite=${limite}`);
        
        isFetching = false;
        clearTimeout(loadingTimeout);

        const ranking = respuesta.data.data;
        const meta = respuesta.data.paginacion;

        if (pageInfo && meta) {
            pageInfo.textContent = `Página ${meta.paginaActual} de ${meta.totalPaginas}`;
            btnPrev.disabled = meta.paginaActual <= 1;
            btnNext.disabled = meta.paginaActual >= meta.totalPaginas;
        }

        // Limpiar contenedores
        podiumSection.innerHTML = '';
        rankingsContainer.innerHTML = '';

        if (!ranking || ranking.length === 0) {
            podiumSection.innerHTML = '<p class="text-center text-gray-500 w-full">No hay datos de ranking disponibles.</p>';
            return;
        }

        if (paginaActual === 1) {
            const top3 = ranking.slice(0, 3);
            const resto = ranking.slice(3);

            renderizarPodio(top3, podiumSection);
            renderizarLista(resto, rankingsContainer, 4);
        } else {
            const offsetVisual = ((paginaActual - 1) * limite) + 1;
            renderizarLista(ranking, rankingsContainer, offsetVisual);
        }

    } catch (error) {
        isFetching = false;
        clearTimeout(loadingTimeout);
        console.error("Error al cargar ranking:", error);
        podiumSection.innerHTML = '<p class="text-center text-red-500 w-full">Error al cargar los rankings.</p>';
    }
}

// Función para construir el Top 3 visual
function renderizarPodio(top3, contenedor) {
    if (top3.length === 0) return;

    const podioFlex = document.createElement('div');
    podioFlex.className = 'flex items-end justify-center gap-3 md:gap-8 w-full';
    
    const crearLugarPodio = (usuario, ordenCaja, alturaClase, bgClase, numLugar, colorPuntos) => {
        const caja = document.createElement('div');
        caja.className = `order-${ordenCaja} flex flex-col items-center w-28 md:w-36 transition-transform hover:-translate-y-2`;

        // --- CREACIÓN DEL AVATAR PÚBLICO ---
        const avatar = document.createElement('img');
        avatar.className = 'w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mb-3 shadow-md border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800';
        
        avatar.src = usuario.foto_perfil
            ? `${api.defaults.baseURL}/perfil/foto/${usuario.foto_perfil}` 
            : 'img/avatar.png';

        avatar.onerror = () => { avatar.src = 'img/avatar.png'; };
        // -----------------------------------

        const nombre = document.createElement('p');
        nombre.className = 'font-bold text-center text-sm md:text-base text-gray-900 dark:text-white truncate w-full px-1';
        nombre.textContent = `${usuario.nombre} ${usuario.ap_paterno || ''}`.trim(); 

        const puntos = document.createElement('p');
        puntos.className = `text-xs font-extrabold mb-3 ${colorPuntos}`;
        puntos.textContent = `${usuario.puntos} pts`;

        const base = document.createElement('div');
        base.className = `w-full ${alturaClase} ${bgClase} rounded-t-xl flex items-start justify-center pt-4 shadow-inner`;
        const numero = document.createElement('span');
        numero.className = 'text-4xl md:text-5xl font-black text-white/90 drop-shadow-md';
        numero.textContent = numLugar;
        base.appendChild(numero);

        caja.append(avatar, nombre, puntos, base);
        return caja;
    };

    if (top3[1]) podioFlex.appendChild(crearLugarPodio(top3[1], '1', 'h-28 md:h-32', 'bg-gray-400', '2', 'text-gray-500 dark:text-gray-400'));
    podioFlex.appendChild(crearLugarPodio(top3[0], '2', 'h-40 md:h-48', 'bg-yellow-400', '1', 'text-yellow-600 dark:text-yellow-500'));
    if (top3[2]) podioFlex.appendChild(crearLugarPodio(top3[2], '3', 'h-20 md:h-24', 'bg-amber-700', '3', 'text-amber-700 dark:text-amber-600'));

    contenedor.appendChild(podioFlex);
}

// Función para construir la lista del resto de usuarios
function renderizarLista(usuarios, contenedor, posicionInicial) {
    usuarios.forEach((usuario, index) => {
        const fila = document.createElement('div');
        fila.className = 'flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group';

        const numero = document.createElement('span');
        numero.className = 'w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold text-sm shrink-0 shadow-sm';
        numero.textContent = posicionInicial + index;

        // --- CREACIÓN DEL AVATAR PÚBLICO ---
        const avatar = document.createElement('img');
        avatar.className = 'w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-transparent group-hover:ring-teal-500 transition-all';
        avatar.src = usuario.foto_perfil
            ? `${api.defaults.baseURL}/perfil/foto/${usuario.foto_perfil}`
            : 'img/avatar.png';
        avatar.onerror = () => { avatar.src = 'img/avatar.png'; };
        // -----------------------------------

        const infoDiv = document.createElement('div');
        infoDiv.className = 'flex-1 min-w-0';

        const nombre = document.createElement('p');
        nombre.className = 'font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-teal-600 transition-colors';
        nombre.textContent = `${usuario.nombre} ${usuario.ap_paterno || ''}`.trim(); 

        infoDiv.appendChild(nombre);

        const puntos = document.createElement('div');
        puntos.className = 'text-sm font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-lg shrink-0';
        puntos.textContent = `${usuario.puntos} pts`;

        fila.append(numero, avatar, infoDiv, puntos); // <- Agregamos el avatar a la fila
        contenedor.appendChild(fila);
    });
}