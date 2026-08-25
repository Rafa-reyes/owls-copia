import api from './api.js';

/*
 * Módulo encargado de la gestión de afiliados.
 *
 * Responsabilidades:
 * - Consumir el directorio del backend.
 * - Renderizar la tabla.
 * - Abrir/cerrar modales.
 * - Validar formularios.
 * - Mantener los datos de los afiliados en memoria.
 * - Evitar inyección XSS utilizando textContent/createElement.
 */


const elementos = {
    tbody: document.getElementById('tabla-cuerpo-miembros'),
    btnNuevo: document.getElementById('btn-nuevo-miembro'),
    modalAlta: document.getElementById('modal-alta'),
    modalEdicion: document.getElementById('modal-edicion'),
    formAlta: document.getElementById('form-alta-miembro'),
    formEdicion: document.getElementById('form-editar-miembro'),
    altaMatricula: document.getElementById('alta-matricula'),
    altaNombre: document.getElementById('alta-nombre'),
    altaApPaterno: document.getElementById('alta-ap-paterno'),
    altaApMaterno: document.getElementById('alta-ap-materno'),
    altaDepartamentos: document.getElementById('alta-departamentos'),
    altaCargos: document.getElementById('alta-cargos'),
    editMatricula: document.getElementById('edit-matricula'),
    editNombre: document.getElementById('edit-nombre'),
    editApPaterno: document.getElementById('edit-ap-paterno'),
    editApMaterno: document.getElementById('edit-ap-materno'),
    editDepartamentos: document.getElementById('edit-departamentos'),
    editCargos: document.getElementById('edit-cargos'),
    mensajeAlta: document.getElementById('mensaje-alta'),
    mensajeEdicion: document.getElementById('mensaje-edicion'),
    errorAltaMatricula: document.getElementById('error-alta-matricula'),
    errorAltaNombre: document.getElementById('error-alta-nombre'),
    errorEditNombre: document.getElementById('error-edit-nombre'),
    
    // --- NUEVO: Elementos de Insignias ---
    selectInsignias: document.getElementById('select-insignias-modal'),
    btnOtorgarInsignia: document.getElementById('btn-otorgar-insignia'),
    msgInsigniaStatus: document.getElementById('msg-insignia-status')
};


/*
 * Cache local de afiliados.
 *
 * No colocamos el objeto completo dentro de HTML.
 * Los botones solamente guardan la matrícula en data-matricula.
 */
const afiliados = new Map();


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

export function inicializarAfiliados() {

    if (!elementos.tbody) {
        console.error('No se encontró la tabla de afiliados.');
        return;
    }

    configurarEventos();
    cargarCatalogoInsignias();
}


/* =========================================================
   EVENTOS
   ========================================================= */

function configurarEventos() {

    elementos.btnNuevo?.addEventListener(
        'click',
        abrirModalAlta
    );


    elementos.formAlta?.addEventListener(
        'submit',
        manejarAlta
    );


    elementos.formEdicion?.addEventListener(
        'submit',
        manejarEdicion
    );
    elementos.btnOtorgarInsignia?.addEventListener('click', manejarOtorgarInsignia);


    /*
     * Delegación de eventos:
     * No necesitamos agregar listeners a cada botón
     * después de renderizar la tabla.
     */
    elementos.tbody.addEventListener(
        'click',
        manejarAccionTabla
    );


    document
        .querySelectorAll('[data-action="cerrar-modal"]')
        .forEach(boton => {

            boton.addEventListener(
                'click',
                () => {

                    const modalId = boton.dataset.modal;

                    if (modalId) {
                        cerrarModal(modalId);
                    }

                }
            );

        });


    /*
     * Permitir cerrar el modal haciendo click en el fondo.
     */
    [elementos.modalAlta, elementos.modalEdicion]
        .filter(Boolean)
        .forEach(modal => {

            modal.addEventListener('click', event => {

                if (event.target === modal) {
                    cerrarModal(modal.id);
                }

            });

        });


    /*
     * Cerrar con Escape.
     */
    document.addEventListener('keydown', event => {

        if (event.key !== 'Escape') {
            return;
        }

        if (!elementos.modalAlta.classList.contains('oculta')) {
            cerrarModal('modal-alta');
        }

        if (!elementos.modalEdicion.classList.contains('oculta')) {
            cerrarModal('modal-edicion');
        }

    });

}


/* =========================================================
   CARGAR DIRECTORIO
   ========================================================= */

export async function cargarDirectorio() {

    mostrarEstadoCarga();

    try {

        const respuesta = await api.get('/admin/directorio');

        const datos = respuesta?.data?.data;

        if (!Array.isArray(datos)) {
            throw new Error(
                'El backend no devolvió un arreglo de afiliados.'
            );
        }


        afiliados.clear();


        datos.forEach(miembro => {

            /*
             * Normalizamos los datos antes de almacenarlos.
             */
            const afiliadoNormalizado = {
                id: miembro.id,

                matricula: miembro.matricula ?? '',

                nombre: miembro.nombre ?? '',

                ap_paterno: miembro.ap_paterno ?? '',

                ap_materno: miembro.ap_materno ?? '',

                nombreCompleto: miembro.nombreCompleto ?? '',

                departamentos:
                    Array.isArray(miembro.departamentos)
                        ? miembro.departamentos
                        : [],

                cargos:
                    Array.isArray(miembro.cargos)
                        ? miembro.cargos
                        : []

            };


            afiliados.set(
                String(afiliadoNormalizado.matricula),
                afiliadoNormalizado
            );

        });


        renderizarTabla();


    } catch (error) {

        console.error(
            'Error al cargar directorio:',
            error
        );

        mostrarEstadoError();

    }

}


/* =========================================================
   TABLA
   ========================================================= */

function renderizarTabla() {

    /*
     * No usamos innerHTML para datos provenientes del backend.
     */
    while (elementos.tbody.firstChild) {
        elementos.tbody.removeChild(
            elementos.tbody.firstChild
        );
    }


    if (afiliados.size === 0) {

        const fila = document.createElement('tr');

        const celda = document.createElement('td');

        celda.colSpan = 5;

        celda.textContent =
            'No hay afiliados registrados.';

        fila.appendChild(celda);

        elementos.tbody.appendChild(fila);

        return;
    }


    afiliados.forEach(miembro => {

        const fila = crearFilaMiembro(miembro);

        elementos.tbody.appendChild(fila);

    });

}


/*
 * Crea una fila completa utilizando DOM API.
 *
 * Esto evita:
 *
 * tr.innerHTML = `...${datoBackend}...`
 *
 * y por lo tanto evita que un valor recibido del backend
 * sea interpretado como HTML.
 */
function crearFilaMiembro(miembro) {

    const fila = document.createElement('tr');


    /* Matrícula */

    const celdaMatricula = document.createElement('td');

    celdaMatricula.textContent =
        String(miembro.matricula);

    fila.appendChild(celdaMatricula);


    /* Nombre */

    const celdaNombre = document.createElement('td');

    celdaNombre.textContent =
        miembro.nombreCompleto;

    fila.appendChild(celdaNombre);


    /* Departamentos */

    const celdaDepartamentos =
        document.createElement('td');

    celdaDepartamentos.appendChild(
        crearEtiquetas(
            miembro.departamentos,
            'etiqueta-departamento'
        )
    );

    fila.appendChild(celdaDepartamentos);


    /* Cargos */

    const celdaCargos =
        document.createElement('td');

    celdaCargos.appendChild(
        crearEtiquetas(
            miembro.cargos,
            'etiqueta-cargo'
        )
    );

    fila.appendChild(celdaCargos);


    /* Acciones */

    const celdaAcciones =
        document.createElement('td');


    const botonEditar =
        document.createElement('button');

    botonEditar.type = 'button';

    botonEditar.classList.add(
        'btn-accion',
        'btn-editar'
    );

    botonEditar.dataset.action = 'editar';

    botonEditar.dataset.matricula =
        String(miembro.matricula);

    botonEditar.textContent = 'Editar';


    const botonEliminar =
        document.createElement('button');

    botonEliminar.type = 'button';

    botonEliminar.classList.add(
        'btn-accion',
        'btn-eliminar'
    );

    botonEliminar.dataset.action = 'eliminar';

    botonEliminar.dataset.matricula =
        String(miembro.matricula);

    botonEliminar.textContent = 'Eliminar';


    celdaAcciones.appendChild(botonEditar);

    celdaAcciones.appendChild(botonEliminar);

    fila.appendChild(celdaAcciones);


    return fila;

}


/* =========================================================
   ETIQUETAS
   ========================================================= */

function crearEtiquetas(arreglo, clase) {

    const contenedor =
        document.createElement('div');

    contenedor.classList.add(
        'contenedor-etiquetas'
    );


    if (
        !Array.isArray(arreglo) ||
        arreglo.length === 0
    ) {

        const texto =
            document.createElement('span');

        texto.classList.add('texto-normal');

        texto.textContent = '-';

        contenedor.appendChild(texto);

        return contenedor;
    }


    arreglo.forEach(item => {

        const etiqueta =
            document.createElement('span');

        etiqueta.classList.add(
            'etiqueta',
            clase
        );

        /*
         * MUY IMPORTANTE:
         * textContent y no innerHTML.
         */
        etiqueta.textContent =
            String(item ?? '');

        contenedor.appendChild(etiqueta);

    });


    return contenedor;

}


/* =========================================================
   ACCIONES DE TABLA
   ========================================================= */

function manejarAccionTabla(event) {

    const boton =
        event.target.closest(
            '[data-action]'
        );


    if (!boton) {
        return;
    }


    const accion =
        boton.dataset.action;

    const matricula =
        boton.dataset.matricula;


    if (!matricula) {
        return;
    }


    switch (accion) {

        case 'editar':

            abrirModalEdicion(matricula);

            break;


        case 'eliminar':

            eliminarMiembro(matricula);

            break;

    }

}


/* =========================================================
   MODAL ALTA
   ========================================================= */

function abrirModalAlta() {

    elementos.formAlta.reset();

    limpiarMensajesAlta();

    abrirModal('modal-alta');

    elementos.altaMatricula.focus();

}


function manejarAlta(event) {

    event.preventDefault();

    limpiarMensajesAlta();


    const matricula =
        elementos.altaMatricula.value.trim();

    const nombre =
        elementos.altaNombre.value.trim();

    const apPaterno =
        elementos.altaApPaterno.value.trim();

    const apMaterno =
        elementos.altaApMaterno.value.trim();

    const departamentos =
        convertirTextoAArreglo(
            elementos.altaDepartamentos.value
        );

    const cargos =
        convertirTextoAArreglo(
            elementos.altaCargos.value
        );


    let formularioValido = true;


    if (!matricula) {

        mostrarError(
            elementos.errorAltaMatricula,
            'La matrícula es obligatoria.'
        );

        formularioValido = false;

    }


    if (!nombre) {

        mostrarError(
            elementos.errorAltaNombre,
            'El nombre es obligatorio.'
        );

        formularioValido = false;

    }


    if (
        matricula &&
        afiliados.has(matricula)
    ) {

        mostrarError(
            elementos.errorAltaMatricula,
            'La matrícula ya existe en el directorio.'
        );

        formularioValido = false;

    }


    if (!formularioValido) {
        return;
    }


    /*
     * Como el backend actualmente no tiene POST,
     * NO hacemos una llamada inventada.
     *
     * Agregamos el registro al estado local para que
     * la interfaz funcione mientras está abierta.
     */
    const nuevoMiembro = {

        matricula,

        nombre,

        ap_paterno: apPaterno,

        ap_materno: apMaterno,

        nombreCompleto:
            [nombre, apPaterno, apMaterno]
                .filter(Boolean)
                .join(' '),

        departamentos,

        cargos

    };


    afiliados.set(
        matricula,
        nuevoMiembro
    );


    renderizarTabla();


    mostrarMensaje(
        elementos.mensajeAlta,
        'Afiliado agregado en la vista. El backend actualmente no dispone de un endpoint POST para persistirlo.',
        'advertencia'
    );


    /*
     * Dejamos el modal visible unos instantes para que
     * el administrador pueda ver el mensaje.
     */
    setTimeout(() => {

        cerrarModal('modal-alta');

    }, 1800);

}


/* =========================================================
   MODAL EDICIÓN
   ========================================================= */

function abrirModalEdicion(matricula) {

    const miembro =
        afiliados.get(
            String(matricula)
        );


    if (!miembro) {

        console.error(
            'No se encontró el afiliado:',
            matricula
        );

        return;
    }


    elementos.formEdicion.reset();

    limpiarMensajesEdicion();


    elementos.editMatricula.value =
        miembro.matricula;
    
    elementos.editMatricula.dataset.idReal = miembro.id;

    elementos.editNombre.value =
        miembro.nombre;

    elementos.editApPaterno.value =
        miembro.ap_paterno;

    elementos.editApMaterno.value =
        miembro.ap_materno;

    elementos.editDepartamentos.value =
        miembro.departamentos.join(', ');

    elementos.editCargos.value =
        miembro.cargos.join(', ');


    abrirModal('modal-edicion');

    elementos.editNombre.focus();

}


function manejarEdicion(event) {

    event.preventDefault();

    limpiarMensajesEdicion();


    const matricula =
        elementos.editMatricula.value;

    const miembro =
        afiliados.get(
            String(matricula)
        );


    if (!miembro) {

        mostrarMensaje(
            elementos.mensajeEdicion,
            'No se encontró el afiliado.',
            'error'
        );

        return;
    }


    const nombre =
        elementos.editNombre.value.trim();

    const apPaterno =
        elementos.editApPaterno.value.trim();

    const apMaterno =
        elementos.editApMaterno.value.trim();


    if (!nombre) {

        mostrarError(
            elementos.errorEditNombre,
            'El nombre es obligatorio.'
        );

        return;
    }


    /*
     * Actualizamos el estado local.
     *
     * No hacemos PUT/PATCH porque el backend actual
     * no tiene un endpoint para editar afiliados.
     */
    miembro.nombre = nombre;

    miembro.ap_paterno = apPaterno;

    miembro.ap_materno = apMaterno;

    miembro.nombreCompleto =
        [nombre, apPaterno, apMaterno]
            .filter(Boolean)
            .join(' ');


    afiliados.set(
        String(matricula),
        miembro
    );


    renderizarTabla();


    mostrarMensaje(
        elementos.mensajeEdicion,
        'Cambios aplicados en la vista. El backend actualmente no dispone de un endpoint PUT/PATCH para persistirlos.',
        'advertencia'
    );


    setTimeout(() => {

        cerrarModal('modal-edicion');

    }, 1800);

}


/* =========================================================
   ELIMINAR
   ========================================================= */

function eliminarMiembro(matricula) {

    const miembro =
        afiliados.get(
            String(matricula)
        );


    if (!miembro) {
        return;
    }


    const confirmado =
        window.confirm(
            `¿Estás seguro de eliminar a ${miembro.nombreCompleto} (${matricula}) de la vista?`
        );


    if (!confirmado) {
        return;
    }


    /*
     * No hacemos DELETE porque no existe endpoint.
     */
    afiliados.delete(
        String(matricula)
    );


    renderizarTabla();

}


/* =========================================================
   MODALES
   ========================================================= */

function abrirModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {
        return;
    }


    modal.classList.remove('oculta');

    modal.setAttribute(
        'aria-hidden',
        'false'
    );

}


function cerrarModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) {
        return;
    }


    modal.classList.add('oculta');

    modal.setAttribute(
        'aria-hidden',
        'true'
    );

}


/* =========================================================
   VALIDACIONES / MENSAJES
   ========================================================= */

function convertirTextoAArreglo(texto) {

    return texto
        .split(',')
        .map(valor => valor.trim())
        .filter(Boolean);

}


function mostrarError(elemento, mensaje) {

    if (!elemento) {
        return;
    }

    elemento.textContent = mensaje;

}


function mostrarMensaje(
    elemento,
    mensaje,
    tipo = 'info'
) {

    if (!elemento) {
        return;
    }


    elemento.className =
        `mensaje-formulario ${tipo}`;


    elemento.textContent =
        mensaje;

}


function limpiarMensajesAlta() {

    elementos.errorAltaMatricula.textContent = '';

    elementos.errorAltaNombre.textContent = '';

    elementos.mensajeAlta.textContent = '';

    elementos.mensajeAlta.className =
        'mensaje-formulario';

}


function limpiarMensajesEdicion() {

    elementos.errorEditNombre.textContent = '';

    elementos.mensajeEdicion.textContent = '';

    elementos.mensajeEdicion.className =
        'mensaje-formulario';

}


/* =========================================================
   ESTADOS DE LA TABLA
   ========================================================= */

function mostrarEstadoCarga() {

    while (elementos.tbody.firstChild) {

        elementos.tbody.removeChild(
            elementos.tbody.firstChild
        );

    }


    const fila =
        document.createElement('tr');

    const celda =
        document.createElement('td');


    celda.colSpan = 5;

    celda.textContent =
        'Cargando afiliados...';


    fila.appendChild(celda);

    elementos.tbody.appendChild(fila);

}


function mostrarEstadoError() {

    while (elementos.tbody.firstChild) {

        elementos.tbody.removeChild(
            elementos.tbody.firstChild
        );

    }


    const fila =
        document.createElement('tr');

    const celda =
        document.createElement('td');


    celda.colSpan = 5;

    celda.textContent =
        'No fue posible cargar el directorio de afiliados.';


    fila.appendChild(celda);

    elementos.tbody.appendChild(fila);

}

//INSIGNIAS

/* =========================================================
   INSIGNIAS (Buscador Autocomplete y Asignación)
   ========================================================= */
let insigniasGlobales = [];

async function cargarCatalogoInsignias() {
    const buscador = document.getElementById('buscador-insignias');
    if (!buscador) return;

    buscador.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    try {
        const respuesta = await api.get('/admin/insignias/catalogo');
        insigniasGlobales = respuesta.data.data;
        
        buscador.addEventListener('input', manejarBuscadorInsignias);
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.relative')) {
                document.getElementById('resultados-insignias').classList.add('hidden');
            }
        });
    } catch (error) {
        console.error("Error al cargar insignias", error);
        buscador.placeholder = "Error al cargar catálogo de insignias";
        buscador.disabled = true;
    }
}

function manejarBuscadorInsignias(e) {
    const texto = e.target.value.toLowerCase();
    const contenedorResultados = document.getElementById('resultados-insignias');
    
    if (texto.length < 1) {
        contenedorResultados.classList.add('hidden');
        return;
    }

    const filtradas = insigniasGlobales.filter(ins => ins.nombre.toLowerCase().includes(texto));
    contenedorResultados.innerHTML = '';

    if (filtradas.length === 0) {
        contenedorResultados.innerHTML = '<div class="p-3 text-sm text-gray-500">No se encontraron insignias</div>';
    } else {
        filtradas.forEach(ins => {
            const div = document.createElement('div');
            div.className = "flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0";
            
            const img = document.createElement('img');
            img.className = 'object-contain flex-shrink-0 drop-shadow-sm';
            img.style.width = '2rem';
            img.style.height = '2rem';
            img.style.minWidth = '2rem';
            
            if (ins.icono && ins.icono.startsWith('http')) {
                img.src = ins.icono;
            } else if (ins.icono) {
                img.src = `${api.defaults.baseURL}/admin/insignias/foto/${ins.icono}`;
            } else {
                img.src = '/img/insignia-default.png';
            }
            const txt = document.createElement('span');
            txt.className = "text-sm font-semibold text-gray-800 dark:text-gray-200";
            txt.textContent = ins.nombre;

            div.append(img, txt);
            
            div.addEventListener('click', () => seleccionarInsigniaVisual(ins, img.src));
            contenedorResultados.appendChild(div);
        });
    }
    
    contenedorResultados.classList.remove('hidden');
}

function seleccionarInsigniaVisual(insignia, imgSrc) {
    document.getElementById('insignia-seleccionada-id').value = insignia.id;
    document.getElementById('buscador-insignias').value = '';
    document.getElementById('resultados-insignias').classList.add('hidden');

    document.getElementById('img-insignia-seleccionada').src = imgSrc;
    document.getElementById('txt-insignia-seleccionada').textContent = insignia.nombre;
    document.getElementById('desc-insignia-seleccionada').textContent = insignia.descripcion || 'Sin descripción';
    
    document.getElementById('preview-insignia-seleccionada').classList.remove('hidden');
    document.getElementById('btn-otorgar-insignia').disabled = false;
}

async function manejarOtorgarInsignia() {
    const insignia_id = document.getElementById('insignia-seleccionada-id').value;
    const alumno_id = elementos.editMatricula.dataset.idReal;
    const btn = document.getElementById('btn-otorgar-insignia');

    if (!insignia_id || !alumno_id) return;

    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Asignando...';

        await api.post('/admin/insignias/otorgar', {
            alumno_id: parseInt(alumno_id),
            insignia_id: parseInt(insignia_id)
        });

        mostrarMensajeInsignia('Insignia otorgada con éxito.', 'green');
        
        setTimeout(() => {
            document.getElementById('preview-insignia-seleccionada').classList.add('hidden');
            document.getElementById('insignia-seleccionada-id').value = '';
            btn.innerHTML = '<i class="fa-solid fa-medal"></i> Asignar';
        }, 1500);

    } catch (error) {
        mostrarMensajeInsignia('Error al otorgar la insignia.', 'red');
        btn.innerHTML = '<i class="fa-solid fa-medal"></i> Asignar';
        btn.disabled = false;
    }
}

function mostrarMensajeInsignia(texto, color) {
    const msg = document.getElementById('msg-insignia-status');
    if (!msg) return;
    msg.textContent = texto;
    msg.className = `text-sm font-medium mt-2 block text-${color}-500`;
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3000);
}