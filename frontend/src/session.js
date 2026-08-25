const API_URL = import.meta.env.VITE_API_URL;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const respuesta = await fetch(`${API_URL}/perfil/me`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!respuesta.ok) {
            console.log("Sesión no activa como invitado.");
            return;
        }

        const usuario = await respuesta.json();

        // 1. Convertir los enlaces estáticos de "Iniciar sesión" a "Mi Perfil"
        document.querySelectorAll('a[href="login.html"], a[href="/login.html"]').forEach(enlace => {
            enlace.innerHTML = `Mi Perfil`;
            enlace.href = "perfil.html";
        });

        const menuNav = document.getElementById('mainNav');
        const themeToggleBtn = document.getElementById('themeToggle');

        if (usuario.roles?.includes('Administrador') && menuNav && !document.getElementById('enlace-admin-dinamico')) {
            const adminEnlace = document.createElement('a');
            adminEnlace.id = 'enlace-admin-dinamico';
            
            // Verificamos si la URL actual es la del panel de administración
            const enPaginaAdmin = window.location.pathname.includes('admin.html');
            
            if (enPaginaAdmin) {
                adminEnlace.href = "perfil.html";
                adminEnlace.innerHTML = `Mi Perfil`;
            } else {
                adminEnlace.href = "admin.html";
                adminEnlace.innerHTML = `Admin`;
            }
            
            adminEnlace.className = "hover:text-teal-600 font-bold text-[#FFA500] flex items-center gap-2";
            themeToggleBtn ? menuNav.insertBefore(adminEnlace, themeToggleBtn) : menuNav.appendChild(adminEnlace);
        }
        if (menuNav && !document.getElementById('btn-logout-dinamico')) {
            const btnLogout = document.createElement('button');
            btnLogout.id = 'btn-logout-dinamico';
            btnLogout.type = 'button';
            btnLogout.className = 'bg-[#FFA500] hover:bg-orange-500 text-gray-900 font-medium py-1.5 px-4 rounded-lg flex items-center gap-2 transition-colors ml-3 shadow-sm';
            btnLogout.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión`;
            btnLogout.addEventListener('click', cerrarSesion);
            
            themeToggleBtn ? menuNav.insertBefore(btnLogout, themeToggleBtn) : menuNav.appendChild(btnLogout);
        }

    } catch (error) {
        console.error("Error validando la sesión global:", error);
    }
});

async function cerrarSesion() {
    try {
        await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    } finally {
        window.location.href = 'index.html'; 
    }
}