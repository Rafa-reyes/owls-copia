import api from './api.js';
import { ImageUploader } from './ImageUploader.js';

const ENDPOINT = '/admin/cursos';

export class CursosManager {
    constructor() {
        this.state = {
            cursos: [],
            filtroDepartamento: 'todos',
            isTableLoading: false,
            isFormSubmitting: false,
            error: null,
            success: null
        };

        this.cacheDOM();
        
        // Inicializamos el validador de imágenes para Cursos
        this.imageUploader = new ImageUploader({
            dropZoneId: 'drop-zone-curso',
            inputId: 'input-file-curso',
            previewImageId: 'preview-img-curso',
            previewContainerId: 'preview-container-curso',
            removeBtnId: 'btn-remove-curso',
            errorId: 'error-imagen-curso',
            textContainerId: 'text-hint-curso'
        });

        this.bindEvents();
    }

    cacheDOM() {
        this.dom = {
            btnNuevo: document.getElementById('btn-nuevo-curso'),
            modal: document.getElementById('modal-curso'),
            form: document.getElementById('form-curso'),
            btnCerrar: document.getElementById('btn-cerrar-modal-curso'),
            btnCancelar: document.getElementById('btn-cancelar-curso'),
            btnGuardar: document.getElementById('btn-guardar-curso'),
            btnGuardarTexto: document.getElementById('btn-guardar-texto'),
            btnGuardarSpinner: document.getElementById('btn-guardar-spinner'),
            tablaCuerpo: document.getElementById('tabla-cuerpo-cursos'),
            alertContainer: document.getElementById('cursos-alert'),
            modalTitulo: document.getElementById('modal-curso-titulo'),
            filtroDepartamento: document.getElementById('filtro-departamento-cursos'),
            
            id: document.getElementById('curso-id'),
            nombre: document.getElementById('curso-nombre'),
            inicio: document.getElementById('curso-inicio'),
            fin: document.getElementById('curso-fin'),
            desc: document.getElementById('curso-desc'),
            
            errNombre: document.getElementById('error-curso-nombre'),
            errInicio: document.getElementById('error-curso-inicio'),
            errFin: document.getElementById('error-curso-fin')
        };
    }

    bindEvents() {
        this.dom.btnNuevo.addEventListener('click', () => this.abrirModal());
        this.dom.btnCerrar.addEventListener('click', () => this.cerrarModal());
        this.dom.btnCancelar.addEventListener('click', () => this.cerrarModal());
        this.dom.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.dom.tablaCuerpo.addEventListener('click', (e) => {
            const btnEditar = e.target.closest('.btn-editar');
            const btnEliminar = e.target.closest('.btn-eliminar');
            
            if (btnEditar) this.cargarCursoParaEdicion(btnEditar.dataset.id);
            if (btnEliminar) this.eliminarCurso(btnEliminar.dataset.id);
        });

        this.dom.nombre.addEventListener('input', () => this.ocultarError(this.dom.errNombre, this.dom.nombre));
        this.dom.inicio.addEventListener('change', () => this.ocultarError(this.dom.errInicio, this.dom.inicio));
        this.dom.fin.addEventListener('change', () => this.ocultarError(this.dom.errFin, this.dom.fin));
        this.dom.filtroDepartamento?.addEventListener('change', (e) => {
            this.setState({ filtroDepartamento: e.target.value });
        });
    }

    get cursosFiltrados() {
        if (this.state.filtroDepartamento === 'todos') return this.state.cursos;
        return this.state.cursos.filter(c => c.departamentos?.includes(this.state.filtroDepartamento));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        if (this.state.isTableLoading) {
            this.dom.tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center p-4">Cargando cursos...</td></tr>';
            return;
        }

        this.dom.tablaCuerpo.innerHTML = '';
        const cursosAMostrar = this.cursosFiltrados;

        if (this.state.cursos.length === 0) {
            this.dom.tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center p-4">No hay cursos registrados.</td></tr>';
        } else {
            this.state.cursos.forEach(curso => {
                const tr = document.createElement('tr');
                tr.className = "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800";
                
                tr.innerHTML = `
                    <td class="p-3">${curso.id}</td>
                    <td class="p-3 font-semibold">${curso.nombre}</td>
                    <td class="p-3">${curso.fecha_inicio ? curso.fecha_inicio.split('T')[0] : 'N/A'}</td>
                    <td class="p-3">${curso.fecha_terminacion ? curso.fecha_terminacion.split('T')[0] : 'N/A'}</td>
                    <td class="p-3 text-center">
                        <button class="btn-editar text-blue-500 hover:text-blue-700 mx-1" data-id="${curso.id}" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-eliminar text-red-500 hover:text-red-700 mx-1" data-id="${curso.id}" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                this.dom.tablaCuerpo.appendChild(tr);
            });
        }

        this.dom.btnGuardar.disabled = this.state.isFormSubmitting;
        this.dom.btnGuardarSpinner.classList.toggle('hidden', !this.state.isFormSubmitting);
        this.dom.btnGuardarTexto.textContent = this.state.isFormSubmitting ? 'Guardando...' : 'Guardar Curso';

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

    async fetchCursos() {
        this.setState({ isTableLoading: true });
        try {
            const respuesta = await api.get('/admin/cursos');
            this.setState({ cursos: respuesta.data.data, isTableLoading: false });
        } catch (error) {
            this.setState({ error: 'Error al cargar los cursos.', isTableLoading: false });
        }
    }

    validarFormulario() {
        let esValido = true;
        const nombreVal = this.dom.nombre.value.trim();
        const inicioVal = this.dom.inicio.value;
        const finVal = this.dom.fin.value;

        if (!nombreVal) {
            this.mostrarError(this.dom.errNombre, this.dom.nombre, 'El nombre del curso es obligatorio.');
            esValido = false;
        } else if (nombreVal.length > 150) {
            this.mostrarError(this.dom.errNombre, this.dom.nombre, 'El nombre no puede exceder los 150 caracteres.');
            esValido = false;
        }

        if (inicioVal && finVal) {
            if (new Date(finVal) < new Date(inicioVal)) {
                this.mostrarError(this.dom.errFin, this.dom.fin, 'La fecha de terminación no puede ser anterior a la de inicio.');
                esValido = false;
            }
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

        // Extraer imagen validada
        const imagenBase64 = this.imageUploader.getBase64();

        const payload = {
            nombre: this.dom.nombre.value.trim(),
            fecha_inicio: this.dom.inicio.value || null,
            fecha_terminacion: this.dom.fin.value || null,
            descripcion: this.dom.desc.value.trim(),
            imagen: imagenBase64
        };

        const id = this.dom.id.value;
        const urlPeticion = id ? `${ENDPOINT}/${id}` : ENDPOINT;

        try {
            await api({
                method: id ? 'put' : 'post',
                url: urlPeticion,
                data: payload
            });
            
            this.setState({
                success: id ? 'Curso actualizado.' : 'Curso creado.',
                isFormSubmitting: false
            });
            this.cerrarModal();
            this.fetchCursos();
        } catch (error) {
            this.setState({ error: error.response?.data?.mensaje || 'Error al guardar.', isFormSubmitting: false });
        }
    }

    abrirModal(curso = null) {
        this.ocultarError(this.dom.errNombre, this.dom.nombre);
        this.ocultarError(this.dom.errInicio, this.dom.inicio);
        this.ocultarError(this.dom.errFin, this.dom.fin);
        this.dom.form.reset();
        
        // Limpiar imagen previa
        this.imageUploader.limpiar();
        
        if (curso) {
            this.dom.modalTitulo.textContent = 'Editar Curso';
            this.dom.id.value = curso.id;
            this.dom.nombre.value = curso.nombre;
            this.dom.inicio.value = curso.fecha_inicio || '';
            this.dom.fin.value = curso.fecha_terminacion || '';
            this.dom.desc.value = curso.descripcion || '';
        } else {
            this.dom.modalTitulo.textContent = 'Nuevo Curso';
            this.dom.id.value = '';
        }
        
        this.dom.modal.classList.remove('oculta');
    }

    cerrarModal() {
        this.dom.modal.classList.add('oculta');
    }

    cargarCursoParaEdicion(id) {
        const curso = this.state.cursos.find(c => c.id == id);
        if(curso) this.abrirModal(curso);
    }

    async eliminarCurso(id) {
        if(!confirm('¿Estás seguro de eliminar este curso?')) return;
        this.setState({ isTableLoading: true });
        try {
            await api.delete(`${ENDPOINT}/${id}`);
            this.setState({ success: 'Curso eliminado permanentemente.' });
            this.fetchCursos();
        } catch(e) {
            this.setState({ error: 'No se pudo eliminar el curso.', isTableLoading: false });
        }
    }
}