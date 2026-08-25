import api from './api.js';
import { ImageUploader } from './ImageUploader.js'; // Importamos la clase

document.addEventListener('DOMContentLoaded', async () => {
    const nameEl = document.getElementById('perfilNombre');
    const roleEl = document.getElementById('perfilRol');
    const emailEl = document.getElementById('perfilCorreo');
    const matEl = document.getElementById('perfilMatricula');
    const apodoEl = document.getElementById('perfilApodo');
    const sexoEl = document.getElementById('perfilSexo');
    const nivelEduEl = document.getElementById('perfilNivelEdu');
    const ubicacionEl = document.getElementById('perfilUbicacion');
    
    let isFetching = true;
    const loadingTimeout = setTimeout(() => {
        if (isFetching) {
            const loadingText = 'Cargando...';
            if (nameEl) nameEl.textContent = loadingText;
            if (roleEl) roleEl.textContent = loadingText;
        }
    }, 300);

    try {
        const { data } = await api.get('/perfil/me');

        isFetching = false;
        clearTimeout(loadingTimeout);

        if (nameEl) nameEl.textContent = data.nombre || 'Sin nombre';
        if (roleEl) roleEl.textContent = (data.roles && data.roles.length > 0) ? data.roles.join(', ') : 'Usuario';
        if (emailEl) emailEl.textContent = data.correo || '—';
        if (matEl) matEl.textContent = data.matricula || '—';
        
        const contenedorInsignias = document.getElementById('contenedor-insignias');
        if (contenedorInsignias) {
            contenedorInsignias.innerHTML = '';

            if (data.insignias && data.insignias.length > 0) {
                data.insignias.forEach(insignia => {
                    const img = document.createElement('img');
                    img.alt = `Insignia: ${insignia.nombre}`;
                    img.title = insignia.nombre;
                    img.className = 'w-16 h-16 object-contain drop-shadow hover:scale-110 transition-transform cursor-pointer';

                    if (insignia.icono && insignia.icono.startsWith('http')) {
                        img.src = insignia.icono;
                    } else if (insignia.icono) {
                        img.src = `${api.defaults.baseURL}/admin/insignias/foto/${insignia.icono}`;
                    } else {
                        img.src = '/img/insignia-default.png';
                    }

                    img.addEventListener('click', () => {
                        document.getElementById('detalle-insignia-img').src = img.src;
                        document.getElementById('detalle-insignia-titulo').textContent = insignia.nombre;
                        document.getElementById('detalle-insignia-desc').textContent = insignia.descripcion || 'Insignia otorgada por logros destacados en OWLS.';
                        
                        const modal = document.getElementById('modal-detalle-insignia');
                        modal.classList.remove('hidden');
                        setTimeout(() => modal.firstElementChild.classList.remove('scale-95'), 10);
                    });

                    contenedorInsignias.appendChild(img);
                });
            } else {
                const msg = document.createElement('p');
                msg.className = 'text-sm text-gray-500 dark:text-gray-400 italic';
                msg.textContent = 'Aún no cuentas con insignias destacadas.';
                contenedorInsignias.appendChild(msg);
            }
        }
        const viewDesc = document.querySelector('[data-view="descripcion"]');
        const viewExp = document.querySelector('[data-view="experiencia"]');
        if (viewDesc && data.descripcion) viewDesc.textContent = data.descripcion;
        if (viewExp && data.experiencia) viewExp.textContent = data.experiencia;
        const avatarImg = document.getElementById('avatarImg');
        
        if (avatarImg && data.foto_perfil) {
            avatarImg.src = `${api.defaults.baseURL}/perfil/foto/${data.foto_perfil}`;
        } else if (avatarImg) {
            avatarImg.src = 'img/avatar.png';
        }

        if (apodoEl) apodoEl.textContent = data.apodo || '—';
        if (sexoEl) sexoEl.textContent = data.sexo || '—';
        if (nivelEduEl) nivelEduEl.textContent = data.nivel_educacion || '—';
        if (ubicacionEl) ubicacionEl.textContent = data.ubicacion || '—';

    } catch (error) {
        isFetching = false;
        clearTimeout(loadingTimeout);
        if (nameEl) nameEl.textContent = 'Error al cargar perfil';
    }

    try {
        const statsResponse = await api.get('/perfil/me/stats');
        const radarData = statsResponse.data.data;
        const esOscuro = document.documentElement.classList.contains('dark');
        const colorTexto = esOscuro ? '#9ca3af' : '#4b5563';
        const colorLineas = esOscuro ? '#374151' : '#e5e7eb';
        const canvasElement = document.getElementById('skillsRadarChart');

        if (canvasElement) {
            const ctx = canvasElement.getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Técnica', 'Práctica', 'Autonomía', 'Ética', 'Trabajo en Equipo'],
                    datasets: [{
                        label: 'Nivel (%)',
                        data: radarData,
                        backgroundColor: 'rgba(255, 165, 0, 0.25)',
                        borderColor: '#FFA500',
                        pointBackgroundColor: '#0d9488',
                        pointBorderColor: '#fff',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 0, max: 100,
                            angleLines: { color: colorLineas },
                            grid: { color: colorLineas },
                            pointLabels: { color: colorTexto, font: { family: 'Inter', size: 12, weight: 'bold' } },
                            ticks: { display: false, stepSize: 20 }
                        }
                    },
                    plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(context) { return ` Nivel: ${context.raw}%`; } } } }
                }
            });
        }
    } catch (errorChart) {
        console.error("Error al renderizar el gráfico:", errorChart);
    }
    
    setupEditableField('descripcion');
    setupEditableField('experiencia');
    setupPasswordForm();
    
    const btnTogglePwd = document.getElementById('btnTogglePassword');
    const btnClosePwd = document.getElementById('btnClosePassword');
    const sectionPwd = document.getElementById('passwordSection');

    if (btnTogglePwd && sectionPwd) {
        btnTogglePwd.addEventListener('click', () => {
            sectionPwd.classList.toggle('hidden');
        });
    }
    if (btnClosePwd && sectionPwd) {
        btnClosePwd.addEventListener('click', () => {
            sectionPwd.classList.add('hidden');
        });
    }

    // ---------------------------------------------------------------------------
    // Lógica para foto de perfil usando el componente de subida unificado
    // ---------------------------------------------------------------------------
    const btnSubirFoto = document.getElementById('btnSubirFotoPerfil');
    
    // Inicializamos el componente apuntando al formulario/UI destinado en perfil.html
    const perfilImageUploader = new ImageUploader({
        dropZoneId: 'drop-zone-perfil',
        inputId: 'input-file-perfil',
        previewImageId: 'preview-img-perfil',
        previewContainerId: 'preview-container-perfil',
        removeBtnId: 'btn-remove-perfil',
        errorId: 'error-imagen-perfil',
        textContainerId: 'text-hint-perfil'
    });
    const btnToggleUpload = document.getElementById('btnToggleUpload');
    const contenedorSubirFoto = document.getElementById('contenedor-subir-foto');
    if (btnToggleUpload && contenedorSubirFoto) {
        btnToggleUpload.addEventListener('click', () => {
            contenedorSubirFoto.classList.toggle('hidden');
        });
    }

    if (btnSubirFoto) {
        btnSubirFoto.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const fotoBase64 = perfilImageUploader.getBase64();
            
            if (!fotoBase64) {
                alert("Por favor selecciona una imagen válida.");
                return;
            }

            try {
                const arr = fotoBase64.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while(n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                
                // 2. Crear un archivo físico (File) a partir de los bytes para engañar a Multer
                const extension = mime.split('/')[1];
                const file = new File([u8arr], `foto_perfil.${extension}`, { type: mime });

                const formData = new FormData();
                formData.append('foto', file);

                const response = await api.patch('/perfil/foto', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                const nuevoNombre = response.data.foto_perfil;
                const avatarImg = document.getElementById('avatarImg');
                
                if (avatarImg) {
                    avatarImg.src = `${api.defaults.baseURL}/perfil/foto/${nuevoNombre}`;
                }
                
                perfilImageUploader.limpiar();
                alert("Foto actualizada exitosamente");
                
                const contenedorSubirFoto = document.getElementById('contenedor-subir-foto');
                if (contenedorSubirFoto) {
                    contenedorSubirFoto.classList.add('hidden');
                }
                
            } catch (error) {
                console.error('Error al subir foto:', error);
                alert(error.response?.data?.mensaje || 'Hubo un error al subir la foto.');
            }
        });
    }
    const btnCerrarInsignia = document.getElementById('btn-cerrar-detalle-insignia');
    const modalInsignia = document.getElementById('modal-detalle-insignia');
    
    if (btnCerrarInsignia && modalInsignia) {
        btnCerrarInsignia.addEventListener('click', () => {
            modalInsignia.firstElementChild.classList.add('scale-95');
            setTimeout(() => modalInsignia.classList.add('hidden'), 200);
        });
        
        modalInsignia.addEventListener('click', (e) => {
            if (e.target === modalInsignia) {
                btnCerrarInsignia.click();
            }
        });
    }
});

function setupEditableField(key, { minLength = 10 } = {}) {
    const toggleBtn = document.querySelector(`.edit-toggle-btn[data-target="${key}"]`);
    const viewEl = document.querySelector(`[data-view="${key}"]`);
    const editEl = document.querySelector(`[data-edit="${key}"]`);
    const textarea = document.querySelector(`textarea[data-field="${key}"]`);
    const errorEl = document.querySelector(`[data-error="${key}"]`);
    const counterEl = document.querySelector(`[data-counter="${key}"]`);
    const successEl = document.querySelector(`[data-success="${key}"]`);
    const saveBtn = document.querySelector(`[data-save="${key}"]`);
    const cancelBtn = document.querySelector(`[data-cancel="${key}"]`);
    if (!toggleBtn || !viewEl || !editEl || !textarea) return;

    const maxLen = textarea.maxLength;
    let originalValue = viewEl.textContent.trim();

    function updateCounter() {
        counterEl.textContent = `${textarea.value.length}/${maxLen}`;
    }

    function clearError() {
        errorEl.classList.add('hidden');
        textarea.classList.remove('border-red-500', 'focus:ring-red-500');
        textarea.classList.add('focus:ring-teal-500');
    }

    function showError(message) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        textarea.classList.add('border-red-500', 'focus:ring-red-500');
        textarea.classList.remove('focus:ring-teal-500');
    }

    function enterEditMode() {
        originalValue = viewEl.textContent.trim();
        textarea.value = originalValue;
        updateCounter();
        clearError();
        successEl.classList.add('hidden');
        viewEl.classList.add('hidden');
        editEl.classList.remove('hidden');
        toggleBtn.classList.add('hidden');
        textarea.focus();
    }

    function exitEditMode() {
        editEl.classList.add('hidden');
        viewEl.classList.remove('hidden');
        toggleBtn.classList.remove('hidden');
    }

    toggleBtn.addEventListener('click', enterEditMode);

    cancelBtn.addEventListener('click', () => {
        textarea.value = originalValue;
        clearError();
        exitEditMode();
    });

    textarea.addEventListener('input', updateCounter);

    saveBtn.addEventListener('click', async () => {
        const value = textarea.value.trim();

        if (value.length === 0) {
            showError('Este campo no puede quedar vacío.');
            return;
        }
        if (value.length < minLength) {
            showError(`Escribe al menos ${minLength} caracteres.`);
            return;
        }

        clearError();
        saveBtn.disabled = true;
        const originalLabel = saveBtn.textContent;
        saveBtn.textContent = 'Guardando...';

        try {
            await api.patch(`/perfil/me`, { [key]: value });

            viewEl.textContent = value;
            exitEditMode();
            successEl.classList.remove('hidden');
            successEl.classList.add('flex');
            setTimeout(() => {
                successEl.classList.add('hidden');
                successEl.classList.remove('flex');
            }, 3000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                return;
            }
            const serverMessage = error.response?.data?.message;
            showError(serverMessage || 'No se pudo guardar. Intenta de nuevo.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = originalLabel;
        }
    });
}

function setupPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (!form) return;

    const currentInput = document.getElementById('currentPassword');
    const newInput = document.getElementById('newPassword');
    const confirmInput = document.getElementById('confirmPassword');
    const successMsg = document.getElementById('passwordSuccess');
    const submitBtn = document.getElementById('passwordSubmitBtn');

    const reqItems = {
        length: document.querySelector('[data-req="length"]'),
        number: document.querySelector('[data-req="number"]'),
        different: document.querySelector('[data-req="different"]'),
    };

    function setError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
        if (message) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            input.classList.add('border-red-500', 'focus:ring-red-500');
            input.classList.remove('focus:ring-teal-500');
        } else {
            errorEl.classList.add('hidden');
            input.classList.remove('border-red-500', 'focus:ring-red-500');
            input.classList.add('focus:ring-teal-500');
        }
    }

    function updateRequirement(el, met) {
        const icon = el.querySelector('i');
        el.classList.toggle('text-green-600', met);
        el.classList.toggle('dark:text-green-400', met);
        el.classList.toggle('text-gray-400', !met);
        icon.classList.toggle('fa-circle-check', met);
        icon.classList.toggle('fa-circle', !met);
    }

    function refreshRequirements() {
        const value = newInput.value;
        updateRequirement(reqItems.length, value.length >= 8);
        updateRequirement(reqItems.number, /\d/.test(value));
        updateRequirement(
            reqItems.different,
            value.length > 0 && value !== currentInput.value
        );
    }

    newInput.addEventListener('input', refreshRequirements);
    currentInput.addEventListener('input', refreshRequirements);

    document.querySelectorAll('.toggle-visibility').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-toggle-for');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            const willShow = input.type === 'password';
            input.type = willShow ? 'text' : 'password';
            icon.classList.toggle('fa-eye', !willShow);
            icon.classList.toggle('fa-eye-slash', willShow);
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        let isValid = true;
        setError('currentPassword', '');
        setError('newPassword', '');
        setError('confirmPassword', '');
        successMsg.classList.add('hidden');
        successMsg.classList.remove('flex');

        if (currentInput.value.trim().length === 0) {
            setError('currentPassword', 'Ingresa tu contraseña actual.');
            isValid = false;
        }

        if (newInput.value.length < 8) {
            setError('newPassword', 'La nueva contraseña debe tener al menos 8 caracteres.');
            isValid = false;
        } else if (!/\d/.test(newInput.value)) {
            setError('newPassword', 'La nueva contraseña debe incluir al menos un número.');
            isValid = false;
        } else if (currentInput.value.length > 0 && newInput.value === currentInput.value) {
            setError('newPassword', 'La nueva contraseña debe ser diferente a la actual.');
            isValid = false;
        }

        if (confirmInput.value !== newInput.value) {
            setError('confirmPassword', 'Las contraseñas no coinciden.');
            isValid = false;
        }

        if (!isValid) return;

        submitBtn.disabled = true;
        const originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Actualizando...';

        try {
            await api.patch('/perfil/password', {
                passwordActual: currentInput.value,
                passwordNueva: newInput.value,
            });

            successMsg.classList.remove('hidden');
            successMsg.classList.add('flex');
            form.reset();
            refreshRequirements();
            setTimeout(() => {
                successMsg.classList.add('hidden');
                successMsg.classList.remove('flex');
            }, 4000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                return;
            }
            const serverMessage = error.response?.data?.message;
            if (error.response && [400, 422].includes(error.response.status)) {
                setError('currentPassword', serverMessage || 'La contraseña actual es incorrecta.');
            } else {
                setError('newPassword', serverMessage || 'No se pudo actualizar la contraseña. Intenta de nuevo.');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }
    });
}