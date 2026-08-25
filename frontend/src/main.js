import './style.css';
import api from './api.js';

document.addEventListener('DOMContentLoaded', async () => {

    const mainNav = document.getElementById('mainNav');
    const path = window.location.pathname;
  // Rutas que requieren sesión activa
    const rutasProtegidas = ['/perfil.html'];
    const isProtectedRoute = rutasProtegidas.some(ruta => path.includes(ruta));

    try {
    // Verificamos si la cookie de sesión es válida
        await api.get('/perfil/me');
    
        if (mainNav) {
        const links = Array.from(mainNav.getElementsByTagName('a'));
        const loginLink = links.find(a => a.textContent.includes('Login'));
            if (loginLink) {
                loginLink.textContent = 'Mi Perfil';
                loginLink.href = 'perfil.html';
        
                const logoutBtn = document.createElement('button');
                logoutBtn.textContent = 'Cerrar Sesión';
                logoutBtn.className = 'hover:text-red-500 font-medium ml-4 transition';
                logoutBtn.onclick = async () => {
                await api.post('/auth/logout');
                    window.location.href = 'index.html';
            };
            mainNav.insertBefore(logoutBtn, loginLink.nextSibling);
            }
        }
    } catch (error) {
        if (isProtectedRoute) {
        window.location.href = 'login.html';
        }
    }
  // --- Mobile Nav ---
    const mobileToggle = document.getElementById("mobileToggle");

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener("click", () => {
            const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
            mobileToggle.setAttribute("aria-expanded", String(!expanded));

            if (mainNav.classList.contains("hidden")) {
                mainNav.classList.remove("hidden");
                mainNav.classList.add(
                "flex", "flex-col", "gap-2", "bg-white", "p-4",
                "absolute", "top-16", "left-0", "right-0", "shadow-md", "dark:bg-gray-900"
                );
            } else {
                mainNav.classList.add("hidden");
                mainNav.classList.remove(
                "flex", "flex-col", "gap-2", "bg-white", "p-4",
                "absolute", "top-16", "left-0", "right-0", "shadow-md", "dark:bg-gray-900"
                );
            }
        });
    }

  // --- Dropdown "Más" ---
    const dropdownToggle = document.getElementById("dropdownToggle");
    const dropdownMenu = document.getElementById("menuMas");

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains("block");

        if (isOpen) {
            dropdownMenu.classList.remove("block");
            dropdownMenu.classList.add("hidden");
            dropdownToggle.setAttribute("aria-expanded", "false");
            dropdownMenu.setAttribute("aria-hidden", "true");
        } else {
            dropdownMenu.classList.remove("hidden");
            dropdownMenu.classList.add("block");
            dropdownToggle.setAttribute("aria-expanded", "true");
            dropdownMenu.setAttribute("aria-hidden", "false");
        }
    });

    document.addEventListener("click", (e) => {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("block");
            dropdownMenu.classList.add("hidden");
            dropdownToggle.setAttribute("aria-expanded", "false");
            dropdownMenu.setAttribute("aria-hidden", "true");
        }
        });
    }

  // --- Carrusel ---
    const carousel = document.querySelector("section .relative");
    if (carousel) {
    const track = carousel.querySelector("ul");
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector("button:first-of-type");
    const nextBtn = carousel.querySelector("button:last-of-type");

    let current = 0;
    const total = slides.length;
    const autoplayInterval = 5000;
    let timer = null;

    function update() {
      track.style.transform = `translateX(-${current * 100}%)`;
    }

    function goTo(index) {
        current = (index + total) % total;
        update();
        resetTimer();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // Autoplay
    function startTimer() { timer = setInterval(next, autoplayInterval); }
    function resetTimer() { if (timer) clearInterval(timer); startTimer(); }
    startTimer();

    // Pausa en hover/focus
    carousel.addEventListener("mouseenter", () => { if (timer) clearInterval(timer); });
    carousel.addEventListener("mouseleave", () => resetTimer());
    carousel.addEventListener("focusin", () => { if (timer) clearInterval(timer); });
    carousel.addEventListener("focusout", () => resetTimer());
    }
});