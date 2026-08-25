import api from './api.js';
import { ImageUploader } from './ImageUploader.js';

export class InsigniasManager {
    constructor() {
        this.state = { insignias: [], editandoId: null };
        this.cacheDOM();
        
        this.imageUploader = new ImageUploader({
            dropZoneId: 'drop-zone-insignia',
            inputId: 'input-file-insignia',
            previewImageId: 'preview-img-insignia',
            previewContainerId: 'preview-container-insignia',
            removeBtnId: 'btn-remove-insignia',
            textContainerId: 'text-hint-insignia'
        });

        this.bindEvents();
    }

    cacheDOM() {
        this.dom = {
            tbody: document.getElementById('tabla-cuerpo-insignias'),
            btnNuevo: document.getElementById('btn-nueva-insignia'),
            modal: document.getElementById('modal-insignia'),
            tituloModal: document.getElementById('modal-insignia-titulo'),
            form: document.getElementById('form-insignia'),
            nombre: document.getElementById('insignia-nombre'),
            descripcion: document.getElementById('insignia-descripcion'),
            url: document.getElementById('insignia-url'),
            btnGuardar: document.getElementById('btn-guardar-insignia'),
            btnCerrarForm: document.querySelectorAll('[data-action="cerrar-modal-insignia"]')
        };
    }

    bindEvents() {
        this.dom.btnNuevo?.addEventListener('click', () => {
            this.state.editandoId = null;
            this.dom.form.reset();
            this.imageUploader.limpiar();
            this.dom.tituloModal.textContent = 'Nueva Insignia Maestra';
            this.dom.btnGuardar.textContent = 'Crear Insignia';
            this.dom.modal.classList.remove('oculta');
        });

        this.dom.btnCerrarForm.forEach(btn => btn.addEventListener('click', () => {
            this.dom.modal.classList.add('oculta');
        }));

        this.dom.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async fetchInsignias() {
        if (!this.dom.tbody) return;
        this.dom.tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4">Cargando catálogo...</td></tr>';
        try {
            const res = await api.get('/admin/insignias/catalogo');
            this.state.insignias = res.data.data;
            this.render();
        } catch (error) {
            this.dom.tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4 text-red-500">Error de conexión.</td></tr>';
        }
    }

    render() {
        this.dom.tbody.innerHTML = '';
        if (this.state.insignias.length === 0) {
            this.dom.tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4">No hay insignias maestras registradas.</td></tr>';
            return;
        }

        this.state.insignias.forEach(ins => {
            const tr = document.createElement('tr');
            tr.className = "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800";
            
            const tdImg = document.createElement('td');
            tdImg.className = "p-3 align-middle";
            
            const img = document.createElement('img');
            img.className = 'object-contain drop-shadow-md mx-auto';
            img.style.width = '3rem';
            img.style.height = '3rem';
            img.style.minWidth = '3rem';
            
            if (ins.icono && ins.icono.startsWith('http')) {
                img.src = ins.icono;
            } else if (ins.icono) {
                img.src = `${api.defaults.baseURL}/admin/insignias/foto/${ins.icono}`;
            } else {
                img.src = '/img/insignia-default.png';
            }
            tdImg.appendChild(img);

            const tdNombre = document.createElement('td');
            tdNombre.className = "p-3 font-semibold";
            tdNombre.textContent = ins.nombre;

            const tdDesc = document.createElement('td');
            tdDesc.className = "p-3 text-sm text-gray-500";
            tdDesc.textContent = ins.descripcion || '-';

            // ZONA DE ACCIONES (Editar y Eliminar)
            const tdAcciones = document.createElement('td');
            tdAcciones.className = "p-3 text-center";
            
            const btnEditar = document.createElement('button');
            btnEditar.className = "text-blue-500 hover:text-blue-700 mx-2 transition-colors";
            btnEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';
            btnEditar.title = "Editar insignia";
            btnEditar.onclick = () => this.abrirModalEdicion(ins);

            const btnEliminar = document.createElement('button');
            btnEliminar.className = "text-red-500 hover:text-red-700 mx-2 transition-colors";
            btnEliminar.innerHTML = '<i class="fa-solid fa-trash"></i>';
            btnEliminar.title = "Eliminar permanentemente";
            btnEliminar.onclick = () => this.eliminarInsignia(ins.id, ins.nombre);

            tdAcciones.append(btnEditar, btnEliminar);
            tr.append(tdImg, tdNombre, tdDesc, tdAcciones);
            this.dom.tbody.appendChild(tr);
        });
    }

    abrirModalEdicion(insignia) {
        this.state.editandoId = insignia.id;
        this.dom.form.reset();
        this.imageUploader.limpiar();
        
        this.dom.tituloModal.textContent = 'Editar Insignia';
        this.dom.btnGuardar.textContent = 'Guardar Cambios';

        this.dom.nombre.value = insignia.nombre;
        this.dom.descripcion.value = insignia.descripcion || '';

        if (insignia.icono && insignia.icono.startsWith('http')) {
            this.dom.url.value = insignia.icono;
        }

        this.dom.modal.classList.remove('oculta');
    }

    async eliminarInsignia(id, nombre) {
        if (!confirm(`¿Estás a punto de eliminar DEFINITIVAMENTE la insignia "${nombre}". Esto la borrará de todos los alumnos que la tengan. ¿Proceder?`)) return;
        
        try {
            await api.delete(`/admin/insignias/maestra/${id}`);
            alert("Insignia eliminada completamente.");
            this.fetchInsignias(); // Recargar tabla dinámicamente
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al eliminar la insignia.");
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.dom.btnGuardar.disabled = true;
        this.dom.btnGuardar.textContent = 'Guardando...';

        try {
            const fotoBase64 = this.imageUploader.getBase64();
            const urlExterna = this.dom.url.value.trim();
            
            if (!fotoBase64 && !urlExterna && !this.state.editandoId) {
                alert("Debes proporcionar una URL externa o subir una imagen local.");
                throw new Error("Validación");
            }

            const formData = new FormData();
            formData.append('nombre', this.dom.nombre.value.trim());
            formData.append('descripcion', this.dom.descripcion.value.trim());
            
            if (urlExterna) {
                formData.append('url_externa', urlExterna);
            } else if (fotoBase64) {
                const arr = fotoBase64.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while(n--) { u8arr[n] = bstr.charCodeAt(n); }
                
                const extension = mime.split('/')[1];
                const file = new File([u8arr], `insignia.${extension}`, { type: mime });
                formData.append('icono_local', file);
            }

            const configHeaders = { headers: { 'Content-Type': 'multipart/form-data' } };
            
            if (this.state.editandoId) {
                await api.put(`/admin/insignias/maestra/${this.state.editandoId}`, formData, configHeaders);
                alert("Insignia actualizada exitosamente");
            } else {
                await api.post('/admin/insignias/maestra', formData, configHeaders);
                alert("Insignia creada exitosamente");
            }

            this.dom.modal.classList.add('oculta');
            window.location.reload();

        } catch (error) {
            if (error.message !== "Validación") {
                alert(error.response?.data?.mensaje || "Error al procesar la insignia");
            }
        } finally {
            this.dom.btnGuardar.disabled = false;
            this.dom.btnGuardar.textContent = this.state.editandoId ? 'Guardar Cambios' : 'Crear Insignia';
        }
    }
}