import api from './api.js';
import { ImageUploader } from './ImageUploader.js';

const ENDPOINT = '/admin/eventos';

export class EventosManager {
    constructor() {
        this.state = {
            eventos: [],
            filtroDepartamento: 'todos',
            isTableLoading: false,
            isFormSubmitting: false,
            error: null,
            success: null
        };

        this.cacheDOM();
        
        this.imageUploader = new ImageUploader({
            dropZoneId: 'drop-zone-actividad',
            inputId: 'input-file-actividad',
            textContainerId: 'drop-zone-text',
            previewContainerId: 'image-preview-container',
            previewImageId: 'image-preview',
            removeBtnId: 'btn-remove-image',
            errorId: 'error-imagen-actividad'
        });

        this.bindEvents();
    }

    cacheDOM() {
        this.dom = {
            btnNuevo: document.getElementById('btn-nuevo-evento'),
            modal: document.getElementById('modal-evento'),
            form: document.getElementById('form-evento'),
            btnCerrarForm: document.querySelector('[data-action="cerrar-modal-evento"]'),
            tablaCuerpo: document.getElementById('tabla-cuerpo-eventos'),
            filtroDepartamento: document.getElementById('filtro-departamento-eventos'),
            
            id: document.getElementById('evento-id'),
            nombre: document.getElementById('evento-nombre'),
            descripcion: document.getElementById('evento-descripcion'),
            inicio: document.getElementById('evento-fecha-inicio'),
            fin: document.getElementById('evento-fecha-fin'),
            tipo: document.getElementById('evento-tipo'),
            plataforma: document.getElementById('evento-plataforma'),
            
            errorFechas: document.getElementById('error-fechas-evento'),
            btnGuardar: document.querySelector('#form-evento button[type="submit"]')
        };
    }

    bindEvents() {
        this.dom.btnNuevo.addEventListener('click', () => this.abrirModal());
        
        if (this.dom.btnCerrarForm) {
            this.dom.btnCerrarForm.addEventListener('click', () => this.cerrarModal());
        }
        
        this.dom.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.dom.tablaCuerpo.addEventListener('click', (e) => {
            const btnEditar = e.target.closest('.btn-editar-evento');
            const btnEliminar = e.target.closest('.btn-eliminar-evento');
            
            if (btnEditar) this.cargarEventoParaEdicion(btnEditar.dataset.id);
            if (btnEliminar) this.eliminarEvento(btnEliminar.dataset.id);
        });

        this.dom.inicio.addEventListener('change', () => this.ocultarErrorFechas());
        this.dom.fin.addEventListener('change', () => this.ocultarErrorFechas());

        this.dom.filtroDepartamento?.addEventListener('change', (e) => {
            this.setState({ filtroDepartamento: e.target.value });
        });
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        if (this.state.isTableLoading) {
            this.dom.tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center p-4"><i class="fa-solid fa-spinner fa-spin text-teal-600 mr-2"></i> Cargando eventos...</td></tr>';
            return;
        }

        this.dom.tablaCuerpo.innerHTML = '';

        // Lógica de Ale: Filtrado en memoria
        const eventosAMostrar = this.state.filtroDepartamento === 'todos'
            ? this.state.eventos 
            : this.state.eventos.filter(ev => ev.departamentos?.includes(this.state.filtroDepartamento));

        if (eventosAMostrar.length === 0) {
            this.dom.tablaCuerpo.innerHTML = '<tr><td colspan="5" class="text-center p-4">No hay eventos registrados.</td></tr>';
        } else {
            eventosAMostrar.forEach(evento => {
                const tr = document.createElement('tr');
                tr.className = "border-b hover:bg-gray-50";
                
                tr.innerHTML = `
                    <td class="p-3 font-semibold">${evento.nombre}</td>
                    <td class="p-3">${evento.fecha_inicio ? evento.fecha_inicio.split('T')[0] : 'N/A'}</td>
                    <td class="p-3">${evento.fecha_fin ? evento.fecha_fin.split('T')[0] : 'N/A'}</td>
                    <td class="p-3">${evento.plataforma || 'N/A'}</td>
                    <td class="p-3 text-center">
                        <button class="btn-editar-evento text-blue-500 hover:text-blue-700 mx-1" data-id="${evento.id}" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-eliminar-evento text-red-500 hover:text-red-700 mx-1" data-id="${evento.id}" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                this.dom.tablaCuerpo.appendChild(tr);
            });
        }

        this.dom.btnGuardar.disabled = this.state.isFormSubmitting;
        this.dom.btnGuardar.textContent = this.state.isFormSubmitting ? 'Guardando...' : 'Guardar';
    }

    async fetchEventos() {
        this.setState({ isTableLoading: true });
        try {
            const respuesta = await api.get(ENDPOINT);
            this.setState({ eventos: respuesta.data.data || [], isTableLoading: false });
        } catch (error) {
            console.error("Error al cargar eventos:", error);
            this.setState({ isTableLoading: false });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validarFechas()) return;

        this.setState({ isFormSubmitting: true });

        const imagenBase64 = this.imageUploader.getBase64();

        const payload = {
            nombre: this.dom.nombre.value.trim(),
            descripcion: this.dom.descripcion.value.trim(),
            fecha_inicio: this.dom.inicio.value,
            fecha_fin: this.dom.fin.value,
            tipo_id: this.dom.tipo.value,
            plataforma_id: this.dom.plataforma.value,
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
            
            this.cerrarModal();
            this.fetchEventos();
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            this.setState({ isFormSubmitting: false });
        }
    }

    async eliminarEvento(id) {
        if(!confirm('¿Estás seguro de eliminar este evento?')) return;
        
        this.setState({ isTableLoading: true });
        try {
            await api.delete(`${ENDPOINT}/${id}`);
            this.fetchEventos();
        } catch(error) {
            console.error("Error al eliminar:", error);
            this.setState({ isTableLoading: false });
        }
    }

    validarFechas() {
        const inicioVal = this.dom.inicio.value;
        const finVal = this.dom.fin.value;

        if (inicioVal && finVal) {
            if (new Date(finVal) < new Date(inicioVal)) {
                this.dom.errorFechas.textContent = 'La fecha de fin no puede ser anterior a la de inicio.';
                this.dom.errorFechas.classList.remove('oculta');
                return false;
            }
        }
        return true;
    }

    ocultarErrorFechas() {
        this.dom.errorFechas.classList.add('oculta');
    }

    abrirModal(evento = null) {
        this.dom.form.reset();
        this.ocultarErrorFechas();
        
        this.imageUploader.limpiar(); 
        
        if (evento) {
            document.getElementById('titulo-modal-evento').textContent = 'Editar Evento';
            this.dom.id.value = evento.id;
            this.dom.nombre.value = evento.nombre;
            this.dom.descripcion.value = evento.descripcion || '';
            this.dom.inicio.value = evento.fecha_inicio ? evento.fecha_inicio.split('T')[0] : '';
            this.dom.fin.value = evento.fecha_fin ? evento.fecha_fin.split('T')[0] : '';
            this.dom.tipo.value = evento.tipo_id || '';
            this.dom.plataforma.value = evento.plataforma_id || '';
            
        } else {
            document.getElementById('titulo-modal-evento').textContent = 'Nuevo Evento';
            this.dom.id.value = '';
        }
        
        this.dom.modal.classList.remove('oculta');
    }

    cerrarModal() {
        this.dom.modal.classList.add('oculta');
    }

    cargarEventoParaEdicion(id) {
        const evento = this.state.eventos.find(e => e.id == id);
        if(evento) this.abrirModal(evento);
    }
}