// Panel de detalles del calendario público.
//
// Responsabilidad única: al hacer clic en un día del calendario,
// filtrar y renderizar las actividades (cursos, eventos, proyectos)
// de esa fecha en el panel lateral.
//
// Usa delegación de eventos: un solo listener sobre el contenedor
// del calendario (#calendar-grid), sin importar cuántas veces se
// vuelva a pintar el calendario (skeleton -> datos -> reintentar).

const TYPE_CONFIG = {
  evento: {
    label: 'Evento',
    icon: 'fa-calendar-days',
    classes: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  curso: {
    label: 'Curso',
    icon: 'fa-graduation-cap',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  proyecto: {
    label: 'Proyecto',
    icon: 'fa-diagram-project',
    classes: 'bg-purple-50 text-purple-700 border-purple-200'
  }
};

const DEFAULT_TYPE_CONFIG = {
  label: 'Actividad',
  icon: 'fa-calendar',
  classes: 'bg-slate-50 text-slate-700 border-slate-200'
};

let calendarContainer = null;
let listenerAttached = false;

let currentEvents = [];
let selectedDate = null;

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || DEFAULT_TYPE_CONFIG;
}

function getDom() {
  return {
    empty: document.getElementById('calendar-details-empty'),
    content: document.getElementById('calendar-details-content'),
    dateEl: document.getElementById('calendar-details-date'),
    countEl: document.getElementById('calendar-details-count'),
    list: document.getElementById('calendar-details-list')
  };
}

function formatDate(dateString) {
  try {
    const date = new Date(`${dateString}T00:00:00`);

    const formatted = new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return dateString;
  }
}

function getEventsForDate(dateString) {
  return currentEvents.filter(event => event.date === dateString);
}

function showEmptyPanel() {
  const { empty, content } = getDom();
  if (!empty || !content) return;

  empty.classList.remove('hidden');
  content.classList.add('hidden');
}

function createActivityCard(activity) {
  const config = getTypeConfig(activity.type);

  const card = document.createElement('article');
  card.className =
    'flex items-start gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm';

  const iconWrap = document.createElement('div');
  iconWrap.className =
    `w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${config.classes}`;

  const icon = document.createElement('i');
  icon.className = `fa-solid ${config.icon}`;
  iconWrap.appendChild(icon);

  const info = document.createElement('div');
  info.className = 'min-w-0';

  const typeLabel = document.createElement('span');
  typeLabel.className = 'block text-[11px] font-semibold uppercase tracking-wide text-slate-400';
  typeLabel.textContent = config.label;

  const title = document.createElement('h3');
  title.className = 'font-semibold text-slate-800 break-words';
  // textContent para prevenir XSS: el título viene de datos del backend/mock.
  title.textContent = activity.title || 'Actividad sin nombre';

  info.append(typeLabel, title);
  card.append(iconWrap, info);

  return card;
}

function renderNoActivities() {
  const message = document.createElement('div');
  message.className =
    'rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center';

  const icon = document.createElement('i');
  icon.className = 'fa-regular fa-calendar-xmark text-2xl text-slate-400 mb-3 block';

  const text = document.createElement('p');
  text.className = 'text-sm text-slate-500';
  text.textContent = 'No hay actividades programadas para este día.';

  message.append(icon, text);
  return message;
}

function renderDetailsFor(dateString) {
  selectedDate = dateString;

  const { empty, content, dateEl, countEl, list } = getDom();
  if (!empty || !content || !dateEl || !countEl || !list) return;

  const activities = getEventsForDate(dateString);

  empty.classList.add('hidden');
  content.classList.remove('hidden');

  dateEl.textContent = formatDate(dateString);
  countEl.textContent = String(activities.length);

  list.replaceChildren();

  if (activities.length === 0) {
    list.appendChild(renderNoActivities());
    return;
  }

  activities.forEach(activity => {
    list.appendChild(createActivityCard(activity));
  });
}

function handleCalendarClick(event) {
  const dayCell = event.target.closest('[data-calendar-date]');
  if (!dayCell) return;

  const date = dayCell.dataset.calendarDate;
  if (!date) return;

  renderDetailsFor(date);
}

function handleCalendarKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  const dayCell = event.target.closest('[data-calendar-date]');
  if (!dayCell) return;

  event.preventDefault();

  const date = dayCell.dataset.calendarDate;
  if (!date) return;

  renderDetailsFor(date);
}

/**
 * Inicializa el panel de detalles. Se llama UNA sola vez desde
 * initCalendar(), no en cada loadCalendar()/reintentar, para no
 * registrar listeners duplicados.
 */
export function initCalendarDetails(container, events = []) {
  calendarContainer = container;
  currentEvents = Array.isArray(events) ? events : [];

  if (!calendarContainer) return;

  if (!listenerAttached) {
    // Delegación de eventos: un único listener para todos los días,
    // presentes y futuros (el calendario se vuelve a pintar en cada carga).
    calendarContainer.addEventListener('click', handleCalendarClick);
    calendarContainer.addEventListener('keydown', handleCalendarKeydown);
    listenerAttached = true;
  }

  showEmptyPanel();
}

/**
 * Se llama cada vez que se cargan/actualizan los eventos
 * (loadCalendar exitoso, reintentar, etc.).
 */
export function updateCalendarDetails(events = []) {
  currentEvents = Array.isArray(events) ? events : [];

  if (selectedDate) {
    renderDetailsFor(selectedDate);
  }
}
