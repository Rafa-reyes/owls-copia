import api from './api.js';

const CONFIG = {
  NOVEDADES_ENDPOINT: '/feed',
  USE_MOCK_DATA: false
};

function mapApiNovedadToCard(apiNovedad) {
  return {
    //cambiar por nombres reales cuandoo esten definidos en el backend
    titulo: apiNovedad.titulo, 
    imagenUrl: apiNovedad.imagen,
    descripcion: apiNovedad.descripcion
  };
}

async function fetchNovedades() {
  if (CONFIG.USE_MOCK_DATA) {
    return getMockNovedades();
  }

  try {
    const respuesta = await api.get(CONFIG.NOVEDADES_ENDPOINT);

    const datos = respuesta.data;

    // si backend envuelve el arreglo (ej results: [] ), ajustar aquí:
    // return datos.results.map(mapApiNovedadToCard);
    return datos.map(mapApiNovedadToCard);
  } catch (error) {
    
    const mensajeError = error.response?.data?.mensaje || 'Error de conexión';
    console.error("Falló la petición:", mensajeError);
    throw new Error(mensajeError);
  }
}

// Datos de ejemplo
function getMockNovedades() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          titulo: 'Suceso importante 1',
          imagenUrl: 'img/cyb.jpg',
          descripcion: 'Descripción breve del suceso.'
        },
        {
          titulo: 'Suceso importante 2',
          imagenUrl: 'img/csoon.jpg',
          descripcion: 'Descripción breve del suceso.'
        }
      ]);
    }, 900); // retraso simulado para ver que se está cargando
  });
}

let track, prevBtn, nextBtn, errorBanner, errorMessage, retryBtn;
let currentIndex = 0;
let totalSlides = 0;

function updateTransform() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function goToPrev() {
  if (totalSlides === 0) return;
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateTransform();
}

function goToNext() {
  if (totalSlides === 0) return;
  currentIndex = (currentIndex + 1) % totalSlides;
  updateTransform();
}

function renderSkeleton() {
  track.innerHTML = "";
  currentIndex = 0;
  totalSlides = 1;

  const li = document.createElement("li");
  li.className = "min-w-full relative animate-pulse";

  const imgPlaceholder = document.createElement("div");
  imgPlaceholder.className = "w-full h-96 md:h-100 bg-gray-300";
  li.appendChild(imgPlaceholder);

  const overlay = document.createElement("div");
  overlay.className = "absolute bottom-4 left-4 bg-black/30 p-3 rounded-md max-w-[70%] w-64";

  const tituloPlaceholder = document.createElement("div");
  tituloPlaceholder.className = "h-4 w-3/4 bg-gray-200 rounded mb-2";
  overlay.appendChild(tituloPlaceholder);

  const descPlaceholder = document.createElement("div");
  descPlaceholder.className = "h-3 w-full bg-gray-200 rounded";
  overlay.appendChild(descPlaceholder);

  li.appendChild(overlay);
  track.appendChild(li);

  updateTransform();
}

function renderError(message) {
  errorMessage.textContent = message;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  errorBanner.classList.add("hidden");
}

function crearSlideNovedad(novedad) {
  const li = document.createElement("li");
  li.className = "min-w-full relative";

  const img = document.createElement("img");
  img.src = novedad.imagenUrl; // asignar a .src no ejecuta HTML, es seguro
  img.alt = novedad.titulo;
  img.className = "w-full h-96 md:h-100 object-cover";
  li.appendChild(img);

  const overlay = document.createElement("div");
  overlay.className = "absolute bottom-4 left-4 bg-black/50 text-white p-3 rounded-md max-w-[70%]";

  const h3 = document.createElement("h3");
  h3.className = "font-semibold";
  h3.textContent = novedad.titulo; // nunca innerHTML
  overlay.appendChild(h3);

  const p = document.createElement("p");
  p.textContent = novedad.descripcion; // nunca innerHTML
  overlay.appendChild(p);

  li.appendChild(overlay);
  return li;
}

function renderNovedades(novedades) {
  track.innerHTML = "";
  currentIndex = 0;
  totalSlides = novedades.length;

  if (totalSlides === 0) {
    const li = document.createElement("li");
    li.className = "min-w-full flex items-center justify-center h-96 md:h-100 text-gray-400 text-sm";
    li.textContent = "No hay novedades por el momento.";
    track.appendChild(li);
    return;
  }

  novedades.forEach(novedad => {
    track.appendChild(crearSlideNovedad(novedad));
  });

  updateTransform();
}

async function loadNovedades() {
  hideError();
  renderSkeleton();

  try {
    const novedades = await fetchNovedades();
    renderNovedades(novedades);
  } catch (error) {
    renderError(error.message || "No se pudieron cargar las novedades.");
  }
}

//esta es la funcion que se manda llamar desde el index.html
export function initNovedades() {
  track = document.getElementById("novedades-track");
  prevBtn = document.getElementById("novedades-prev");
  nextBtn = document.getElementById("novedades-next");
  errorBanner = document.getElementById("novedades-error-banner");
  errorMessage = document.getElementById("novedades-error-message");
  retryBtn = document.getElementById("novedades-retry-btn");

  if (!track) {
    console.warn("initNovedades(): no se encontró #novedades-track en el DOM.");
    return;
  }

  prevBtn.addEventListener("click", goToPrev);
  nextBtn.addEventListener("click", goToNext);
  retryBtn.addEventListener("click", loadNovedades);

  loadNovedades();
}
