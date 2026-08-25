import api from './api.js';
import { ImageUploader } from './ImageUploader.js';

const ENDPOINT = '/admin/proyectos';

export class ProyectosManager {
    constructor() {
        this.state = {
            proyectos: [],
            isTableLoading: false,
            isFormSubmitting: false,
            error: null,
            success: null
        };

        this.cacheDOM();
        
        // Inicializamos el validador de imágenes para Proyectos
        this.imageUploader = new ImageUploader({
            dropZoneId: 'drop-zone-proyecto',
            inputId: 'input-file-proyecto',
            previewImageId: 'preview-img-proyecto',
            previewContainerId: 'preview-container-proyecto',
            removeBtnId: 'btn-remove-proyecto',
            errorId: 'error-imagen-proyecto',
            textContainerId: 'text-hint-proyecto'
        });

        this.bindEvents();
    }

    cacheDOM() {
        this.dom = {
            btnNuevo: document.getElementById('btn-nuevo-proyecto'),
            modal: document.getElementById('modal-proyecto'),
            form: document.getElementById('form-proyecto'),
            btnCerrar: document.getElementById('btn-cerrar-modal-proyecto'),
            btnCancelar: document.getElementById('btn-cancelar-proyecto'),
            btnGuardar: document.getElementById('btn-guardar-proyecto'),
            btnGuardarTexto: document.getElementById('btn-guardar-texto-proyecto'),
            btnGuardarSpinner: document.getElementById('btn-guardar-spinner-proyecto'),
            tablaCuerpo: document.getElementById('tabla-cuerpo-proyectos'),
            alertContainer: document.getElementById('proyectos-alert'),
            modalTitulo: document.getElementById('modal-proyecto-titulo'),
            
            id: document.getElementById('proyecto-id'),
            nombre: document.getElementById('proyecto-nombre'),
            inicio: document.getElementById('proyecto-inicio'),
            fin: document.getElementById('proyecto-fin'),
            
            errNombre: document.getElementById('error-proyecto-nombre'),
            errInicio: document.getElementById('error-proyecto-inicio'),
            errFin: document.getElementById('error-proyecto-fin')
        };
    }

    bindEvents() {
        this.dom.btnNuevo.addEventListener('click', () => this.abrirModal());
        this.dom.btnCerrar.addEventListener('click', () => this.cerrarModal());
        this.dom.btnCancelar.addEventListener('click', () => this.cerrarModal());
        this.dom.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.dom.tablaCuerpo.addEventListener('click', (e) => {
            const btnEditar = e.target.closest('.btn-editar-proyecto');
            const btnEliminar = e.target.closest('.btn-eliminar-proyecto');
            
            if (btnEditar) this.cargarProyectoParaEdicion(btnEditar.dataset.id);
            if (btnEliminar) this.eliminarProyecto(btnEliminar.dataset.id);
        });

        this.dom.nombre.addEventListener('input', () => this.ocultarError(this.dom.errNombre, this.dom.nombre));
        this.dom.inicio.addEventListener('change', () => this.verificarFechas());
        this.dom.fin.addEventListener('change', () => this.verificarFechas());
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        if (this.state.isTableLoading) {
            this.dom.tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center p-4">Cargando proyectos...</td></tr>';
            return;
        }

        this.dom.tablaCuerpo.innerHTML = '';
        if (this.state.proyectos.length === 0) {
            this.dom.tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center p-4">No hay proyectos registrados.</td></tr>';
        } else {
            this.state.proyectos.forEach(proyecto => {
                const tr = document.createElement('tr');
                tr.className = "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800";
                
                tr.innerHTML = `
                    <td class="p-3">${proyecto.id}</td>
                    <td class="p-3 font-semibold">${proyecto.nombre}</td>
                    <td class="p-3">${proyecto.inicio ? proyecto.inicio.split('T')[0] : 'N/A'}</td>
                    <td class="p-3">${proyecto.fin ? proyecto.fin.split('T')[0] : 'N/A'}</td>
                    <td class="p-3 text-center">
                        <button class="btn-editar-proyecto text-blue-500 hover:text-blue-700 mx-1" data-id="${proyecto.id}" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-eliminar-proyecto text-red-500 hover:text-red-700 mx-1" data-id="${proyecto.id}" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                this.dom.tablaCuerpo.appendChild(tr);
            });
        }

        this.dom.btnGuardar.disabled = this.state.isFormSubmitting;
        this.dom.btnGuardarSpinner.classList.toggle('hidden', !this.state.isFormSubmitting);
        this.dom.btnGuardarTexto.textContent = this.state.isFormSubmitting ? 'Guardando...' : 'Guardar';

        if (this.state.error || this.state.success) {
            this.dom.alertContainer.classList.remove('oculta');
            this.dom.alertContainer.className = `p-3 mb-4 rounded border ${this.state.error ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`;
            this.dom.alertContainer.textContent = this.state.error || this.state.success;
            setTimeout(() => {
                this.dom.alertContainer.classList.add('oculta');
                this.setState({ error: null, success: null });
            }, 5000);
        } else {
            this.dom.alertContainer.classList.add('oculta');
        }
    }

    async fetchProyectos() {
        this.setState({ isTableLoading: true });
        try {
            const respuesta = await api.get(ENDPOINT);
            this.setState({ proyectos: respuesta.data.data, isTableLoading: false });
        } catch (error) {
            this.setState({ error: 'Error al cargar los proyectos.', isTableLoading: false });
        }
    }

    verificarFechas() {
        this.ocultarError(this.dom.errInicio, this.dom.inicio);
        this.ocultarError(this.dom.errFin, this.dom.fin);
        
        const inicioVal = this.dom.inicio.value;
        const finVal = this.dom.fin.value;

        if (inicioVal && finVal) {
            if (new Date(finVal) < new Date(inicioVal)) {
                this.mostrarError(this.dom.errFin, this.dom.fin, 'La fecha de fin no puede ser anterior al inicio.');
                this.mostrarError(this.dom.errInicio, this.dom.inicio, 'Revisa la fecha.');
                return false;
            }
        }
        return true;
    }

    validarFormulario() {
        let esValido = true;
        const nombreVal = this.dom.nombre.value.trim();

        if (!nombreVal) {
            this.mostrarError(this.dom.errNombre, this.dom.nombre, 'El nombre del proyecto es obligatorio.');
            esValido = false;
        } else if (nombreVal.length > 150) {
            this.mostrarError(this.dom.errNombre, this.dom.nombre, 'El nombre no puede exceder los 150 caracteres.');
            esValido = false;
        }

        if (!this.verificarFechas()) {
            esValido = false;
        }
        return esValido;
    }

    mostrarError(elementoError, inputElem, mensaje) {
        elementoError.textContent = mensaje;
        elementoError.classList.remove('hidden');
        inputElem.classList.add('border-red-500');
    }

    ocultarError(elementoError, inputElem) {
        elementoError.classList.add('hidden');
        inputElem.classList.remove('border-red-500');
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validarFormulario()) return;

        this.setState({ isFormSubmitting: true });

        // Extraer imagen
        const imagenBase64 = this.imageUploader.getBase64();

        const payload = {
            nombre: this.dom.nombre.value.trim(),
            inicio: this.dom.inicio.value || null,
            fin: this.dom.fin.value || null,
            imagen: imagenBase64
        };

        const id = this.dom.id.value;
        const endpoint = id ? `${ENDPOINT}/${id}` : ENDPOINT;

        try {
            await api({
                method: id ? 'put' : 'post',
                url: endpoint,
                data: payload
            });
            
            this.setState({
                success: id ? 'Proyecto actualizado.' : 'Proyecto creado.',
                isFormSubmitting: false
            });
            this.cerrarModal();
            this.fetchProyectos();
        } catch (error) {
            this.setState({ error: error.response?.data?.mensaje || 'Error al guardar.', isFormSubmitting: false });
        }
    }

    abrirModal(proyecto = null) {
        this.ocultarError(this.dom.errNombre, this.dom.nombre);
        this.ocultarError(this.dom.errInicio, this.dom.inicio);
        this.ocultarError(this.dom.errFin, this.dom.fin);
        this.dom.form.reset();
        
        // Limpiar imagen previa
        this.imageUploader.limpiar();
        
        if (proyecto) {
            this.dom.modalTitulo.textContent = 'Editar Proyecto';
            this.dom.id.value = proyecto.id;
            this.dom.nombre.value = proyecto.nombre;
            this.dom.inicio.value = proyecto.inicio ? proyecto.inicio.split('T')[0] : '';
            this.dom.fin.value = proyecto.fin ? proyecto.fin.split('T')[0] : '';
        } else {
            this.dom.modalTitulo.textContent = 'Nuevo Proyecto';
            this.dom.id.value = '';
        }
        
        this.dom.modal.classList.remove('oculta');
    }

    cerrarModal() {
        this.dom.modal.classList.add('oculta');
    }

    cargarProyectoParaEdicion(id) {
        const proyecto = this.state.proyectos.find(p => p.id == id);
        if(proyecto) this.abrirModal(proyecto);
    }

    async eliminarProyecto(id) {
        if(!confirm('¿Estás seguro de eliminar este proyecto?')) return;
        this.setState({ isTableLoading: true });
        try {
            await api.delete(`${ENDPOINT}/${id}`);
            this.setState({ success: 'Proyecto eliminado.' });
            this.fetchProyectos();
        } catch(e) {
            this.setState({ error: 'No se pudo eliminar.', isTableLoading: false });
        }
    }
}