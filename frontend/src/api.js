import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // no modificar, esto permite el flujo de peticiones
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      //Si el error 401 viene del login, no congelamos la pantalla
        if (!error.config.url.includes('/login')) {
            document.body.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-gray-950 text-white text-2xl font-bold">Sesión caducada. Redirigiendo al login...</div>';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }

    }
    return Promise.reject(error);
    }
);
export default api;