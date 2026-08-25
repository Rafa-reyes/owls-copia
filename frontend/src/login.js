import api from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const loginMessage = document.getElementById('loginMessage');
    const btnReset = document.getElementById('btnReset');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const correo = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!correo || !password) {
                loginMessage.classList.remove('hidden')
                loginMessage.textContent = 'El usuario (correo) y contraseña son obligatorios.';
                return;
            }

            // UI: Prevenir doble click
            btnLogin.disabled = true;
            btnLogin.textContent = 'Procesando...';
            loginMessage.textContent = '';
            loginMessage.classList.remove('text-green-400', 'text-red-400', 'hidden');

            try {
                // Hacer el POST a la ruta /auth/login del backend usando nuestra api
                const response = await api.post('/auth/login', { correo, password });
                
                loginMessage.classList.add('text-green-400');
                loginMessage.textContent = response.data.mensaje || '¡Éxito! Redirigiendo...';

                // Redirigir al perfil al completar
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 1000);

            } catch (error) {
                btnLogin.disabled = false;
                btnLogin.textContent = 'Ingresar';
                loginMessage.classList.remove('hidden');
                loginMessage.classList.add('text-red-400');
                // Mostrar el error
                loginMessage.textContent = error.response?.data?.error || 'Error al conectar con el servidor.';
            }
        });

        // Funcionalidad del botón Limpiar
        btnReset.addEventListener('click', () => {
            loginForm.reset();
            loginMessage.textContent = '';
            loginMessage.classList.add('hidden');
        });
    }
});