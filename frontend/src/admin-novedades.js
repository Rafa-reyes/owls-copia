// Gestión de Novedades (Admin).
//
// Permite a los líderes destacar hasta 3 actividades (cursos/eventos)
// para la página principal. Toda la regla de negocio "máximo 3" se
// valida en el cliente para evitar peticiones de red redundantes.
//
// IMPORTANTE: el backend todavía no expone un endpoint para guardar
// destacados, así que el guardado usa persistencia local (localStorage),
// siguiendo el mismo patrón USE_MOCK_DATA que ya usa calendarEvents.js.
// Cuando exista el endpoint real, basta con poner USE_MOCK_PERSISTENCE
// en false: guardarSeleccion()/cargarSeleccionGuardada() ya llaman a
// api.put/api.get contra CONFIG.ENDPOINT.

import api from './api.js';

const CONFIG = {
  MAX_DESTACADAS: 3,
  ENDPOINT: '/admin/novedades', // Endpoint aún no existe en el backend.
  USE_MOCK_PERSISTENCE: false,
  STORAGE_KEY: 'owls_novedades_destacadas'
};

const TIPO_LABELS = {
  evento: 'Evento',
  curso: 'Curso'
};

/* =========================================================================
   Funciones auxiliares de datos (separadas para no inflar los métodos
   de la clase con más de 20 líneas de lógica).
   ========================================================================= */

function mapearEventos(eventosData) {
  return (eventosData || []).map((ev) => ({
    id: `evento-${ev.id}`,
    tipo: 'evento',
    nombre: ev.nombre_evento || 'Evento sin nombre'
  }));
}

function mapearCursos(cursosData) {
  return (cursosData || []).map((c) => ({
    id: `curso-${c.id}`,
    tipo: 'curso',
    nombre: c.nombre || 'Curso sin nombre'
  }));
}

async function persistirSeleccion(ids) {
  if (CONFIG.USE_MOCK_PERSISTENCE) {
    window.localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(ids));
    return;
  }
  const peticiones = ids.map(id => api.patch(`/admin/novedades/${id}/destacado`));
  await Promise.all(peticiones);
}

export class NovedadesManager {
  constructor() {
    this.dom = {
      lista: document.getElementById('novedades-lista'),
      contador: document.getElementById('novedades-seleccionadas'),
      botonGuardar: document.getElementById('btn-guardar-novedades'),
      mensaje: document.getElementById('novedades-mensaje')
    };

    this.state = {
      actividades: [],
      seleccionadas: new Set(),
      cargando: false,
      guardando: false,
      cambiosPendientes: false
    };

    this._initEventListeners();
  }

  _initEventListeners() {
    // Delegación de eventos: un único listener para todas las tarjetas,
    // sin importar cuántas se rendericen ni cuántas veces se recarguen.
    this.dom.lista?.addEventListener('change', (event) => {
      const checkbox = event.target.closest('[data-action="toggle-novedad"]');
      if (!checkbox) return;

      this.toggleSeleccion(checkbox);
    });

    this.dom.botonGuardar?.addEventListener('click', () => this.guardar());
  }

  mostrarMensaje(texto, tipo = 'error') {
    const { mensaje } = this.dom;
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.classList.remove('oculta', 'mensaje-alerta-error', 'mensaje-alerta-exito');
    mensaje.classList.add('mensaje-alerta', tipo === 'success' ? 'mensaje-alerta-exito' : 'mensaje-alerta-error');
  }

  ocultarMensaje() {
    this.dom.mensaje?.classList.add('oculta');
  }

  actualizarContador() {
    if (this.dom.contador) {
      this.dom.contador.textContent = String(this.state.seleccionadas.size);
    }
  }

  actualizarBotonGuardar() {
    const { botonGuardar } = this.dom;
    if (!botonGuardar) return;

    // Regla de negocio en cliente: nunca permitir guardar con más
    // de 3 destacados, y evitar guardados innecesarios sin cambios.
    const dentroDelLimite = this.state.seleccionadas.size <= CONFIG.MAX_DESTACADAS;

    botonGuardar.disabled =
      this.state.cargando ||
      this.state.guardando ||
      !dentroDelLimite ||
      !this.state.cambiosPendientes;
  }

  /**
   * Trae cursos y eventos existentes (endpoints ya disponibles en el
   * backend, sin necesidad de crear nada nuevo) y arma la lista de
   * actividades que se pueden destacar.
   */
  async fetchActividades() {
    if (this.state.cargando) return;

    this.state.cargando = true;
    this.actualizarBotonGuardar();
    this.renderCargando();

    try {
      const [eventosResp, cursosResp] = await Promise.all([
        api.get('/admin/eventos'),
        api.get('/admin/cursos')
      ]);

      const eventos = mapearEventos(eventosResp.data?.data);
      const cursos = mapearCursos(cursosResp.data?.data);

      this.state.actividades = [...eventos, ...cursos];
      this.state.seleccionadas = await this.cargarSeleccionGuardada();
      this.state.cambiosPendientes = false;

      this.ocultarMensaje();
      this.render();
    } catch (error) {
      console.error('Falló la carga de actividades:', error);
      this.mostrarMensaje('No se pudieron cargar las actividades. Intenta de nuevo.');
      this.state.actividades = [];
      this.render();
    } finally {
      this.state.cargando = false;
      this.actualizarContador();
      this.actualizarBotonGuardar();
    }
  }

  toggleSeleccion(checkbox) {
    const id = checkbox.dataset.id;

    if (checkbox.checked) {
      // Segunda barrera además del atributo disabled: por si el
      // estado cambió entre renders.
      if (this.state.seleccionadas.size >= CONFIG.MAX_DESTACADAS) {
        checkbox.checked = false;
        this.mostrarMensaje(`Solo puedes destacar un máximo de ${CONFIG.MAX_DESTACADAS} actividades.`);
        return;
      }

      this.state.seleccionadas.add(id);
    } else {
      this.state.seleccionadas.delete(id);
    }

    this.state.cambiosPendientes = true;
    this.ocultarMensaje();
    this.actualizarContador();
    this.actualizarEstadoTarjeta(id);
    this.actualizarDisponibilidadCheckboxes();
    this.actualizarBotonGuardar();
  }

  actualizarEstadoTarjeta(id) {
    const card = this.dom.lista?.querySelector(`[data-novedad-id="${CSS.escape(id)}"]`);
    if (!card) return;

    const seleccionada = this.state.seleccionadas.has(id);
    card.classList.toggle('seleccionada', seleccionada);
  }

  /**
   * Cuando ya hay 3 destacados, deshabilita (sin desmarcar) las
   * casillas restantes: evita que el usuario pueda intentar una
   * cuarta selección inválida desde la interfaz.
   */
  actualizarDisponibilidadCheckboxes() {
    const limiteAlcanzado = this.state.seleccionadas.size >= CONFIG.MAX_DESTACADAS;

    this.dom.lista?.querySelectorAll('[data-action="toggle-novedad"]').forEach((checkbox) => {
      checkbox.disabled = limiteAlcanzado && !checkbox.checked;
    });
  }

  renderCargando() {
    const { lista } = this.dom;
    if (!lista) return;

    lista.replaceChildren();

    const mensaje = document.createElement('p');
    mensaje.className = 'novedades-estado';
    mensaje.textContent = 'Cargando actividades...';
    lista.appendChild(mensaje);
  }

  render() {
    const { lista } = this.dom;
    if (!lista) return;

    lista.replaceChildren();

    if (this.state.actividades.length === 0) {
      const vacio = document.createElement('p');
      vacio.className = 'novedades-estado';
      vacio.textContent = 'No hay cursos ni eventos disponibles para destacar.';
      lista.appendChild(vacio);
      this.actualizarContador();
      return;
    }

    this.state.actividades.forEach((actividad) => {
      lista.appendChild(this.crearTarjeta(actividad));
    });

    this.actualizarContador();
    this.actualizarDisponibilidadCheckboxes();
  }

  crearTarjeta(actividad) {
    const seleccionada = this.state.seleccionadas.has(actividad.id);

    const card = document.createElement('article');
    card.className = `tarjeta-novedad${seleccionada ? ' seleccionada' : ''}`;
    card.dataset.novedadId = actividad.id;

    const encabezado = document.createElement('div');
    encabezado.className = 'novedad-encabezado';

    const info = document.createElement('div');

    const tipo = document.createElement('span');
    tipo.className = `etiqueta etiqueta-${actividad.tipo === 'curso' ? 'departamento' : 'cargo'}`;
    tipo.textContent = TIPO_LABELS[actividad.tipo] || 'Actividad';

    const nombre = document.createElement('p');
    nombre.className = 'novedad-nombre';
    // textContent: los datos vienen del backend, nunca se usa innerHTML.
    nombre.textContent = actividad.nombre;

    info.append(tipo, nombre);

    const label = document.createElement('label');
    label.className = 'novedad-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.action = 'toggle-novedad';
    checkbox.dataset.id = actividad.id;
    checkbox.checked = seleccionada;

    const texto = document.createElement('span');
    texto.textContent = 'Destacar';

    label.append(checkbox, texto);

    encabezado.append(info, label);
    card.appendChild(encabezado);

    return card;
  }

  async cargarSeleccionGuardada() {
    if (CONFIG.USE_MOCK_PERSISTENCE) {
      try {
        const guardado = window.localStorage.getItem(CONFIG.STORAGE_KEY);
        const ids = guardado ? JSON.parse(guardado) : [];
        return new Set(Array.isArray(ids) ? ids : []);
      } catch (error) {
        console.error('No se pudo leer la selección guardada:', error);
        return new Set();
      }
    }

    try {
      const { data } = await api.get(CONFIG.ENDPOINT);
      return new Set(data?.actividades || []);
    } catch (error) {
      console.error('No se pudo obtener la selección de destacados:', error);
      return new Set();
    }
  }

  async guardar() {
    if (this.state.guardando) return;

    // Segunda protección antes de "tocar red" (o localStorage).
    if (this.state.seleccionadas.size > CONFIG.MAX_DESTACADAS) {
      this.mostrarMensaje(`No puedes guardar más de ${CONFIG.MAX_DESTACADAS} actividades destacadas.`);
      return;
    }

    this.state.guardando = true;
    this.actualizarBotonGuardar();

    try {
      await persistirSeleccion([...this.state.seleccionadas]);

      this.state.cambiosPendientes = false;
      this.mostrarMensaje('Las novedades se guardaron correctamente.', 'success');
    } catch (error) {
      console.error('Falló el guardado de novedades:', error);
      const mensajeError = error.response?.data?.mensaje || 'No se pudieron guardar las novedades.';
      this.mostrarMensaje(mensajeError);
    } finally {
      this.state.guardando = false;
      this.actualizarBotonGuardar();
    }
  }
}
