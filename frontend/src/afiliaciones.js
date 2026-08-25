import api from './api.js';

const PUBLIC_ENDPOINT = '/patrocinios'; 
const SKELETON_COUNT = 8;

const grid = document.getElementById("afiliacionesGrid");
const errorBox = document.getElementById("afiliacionesError");
const retryBtn = document.getElementById("retryAfiliacionesBtn");

function renderSkeletons() {
  errorBox.classList.add("hidden");
  grid.innerHTML = "";
  
  for (let i = 0; i < SKELETON_COUNT; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col items-center";
    skeleton.innerHTML = `
      <div class="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
      <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div class="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
      <div class="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
    `;
    grid.appendChild(skeleton);
  }
}

function renderAfiliados(afiliados) {
  grid.innerHTML = "";
  
  if (!Array.isArray(afiliados) || afiliados.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">Aún no hay afiliaciones para mostrar.</p>`;
    return;
  }

  afiliados.forEach((afiliado) => {
    const article = document.createElement("article");
    article.className = "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow";

    const img = document.createElement("img");
    img.src = afiliado.logo || 'img/owls.png';
    img.alt = afiliado.nombre_patrocinador;
    img.className = "h-16 w-16 object-contain mb-4";
    img.loading = "lazy";

    const h3 = document.createElement("h3");
    h3.className = "font-semibold text-lg mb-1 text-gray-900 dark:text-white";
    h3.textContent = afiliado.nombre_patrocinador;

    article.append(img, h3);

    if (afiliado.colonia) {
      const p = document.createElement("p");
      p.className = "text-sm text-gray-600 dark:text-gray-400 mb-3";
      p.textContent = `Ubicado en: ${afiliado.colonia}`;
      article.appendChild(p);
    }

    grid.appendChild(article);
  });
}

function renderError() {
  grid.innerHTML = "";
  errorBox.classList.remove("hidden");
}

async function loadAfiliaciones() {
  renderSkeletons();

  try {
    const { data } = await api.get(PUBLIC_ENDPOINT);
    renderAfiliados(data.patrocinadores);
  } catch (error) {
    console.error("Error al cargar afiliaciones:", error);
    renderError();
  }
}

retryBtn?.addEventListener("click", loadAfiliaciones);
document.addEventListener("DOMContentLoaded", loadAfiliaciones);