// Carga los eventos desde la API (vía api.js / axios),
// muestra un skeleton mientras carga,
// pinta el calendario con los eventos reales
// y maneja errores con opción de reintentar.

import api from './api.js';
import { initCalendarDetails, updateCalendarDetails } from './calendarDetails.js';

/* Ruta real del endpoint */
const CONFIG = {
  EVENTS_ENDPOINT: '/admin/eventos/vigentes',
  USE_MOCK_DATA: false
};

function getCurrentDate() {
  const today = new Date();

  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate()
  };
}

/* ====================================
   DATOS DEL CALENDARIO
   ==================================== */

const monthsEs = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/*
 * Genera dinámicamente las semanas del mes utilizando Date.
 *
 * Ya no se utiliza una matriz estática para 2026.
 *
 * Cada posición representa:
 * - un día del mes
 * - null cuando la celda está fuera del mes.
 */
function generateMonthWeeks(year, month) {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const totalCells = Math.ceil(
    (firstDayOfMonth + daysInMonth) / 7
  ) * 7;

  const weeks = [];
  let currentWeek = [];

  for (let cell = 0; cell < totalCells; cell++) {
    const day = cell - firstDayOfMonth + 1;

    currentWeek.push(
      day >= 1 && day <= daysInMonth ? day : null
    );

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return weeks;
}

/* Color del punto indicador en el calendario */
const EVENT_TYPE_COLORS = {
  evento: 'bg-blue-500 ring-2 ring-blue-100',
  curso: 'bg-emerald-500 ring-2 ring-emerald-100',
  proyecto: 'bg-purple-500 ring-2 ring-purple-100'
};

const DEFAULT_DOT_COLOR = 'bg-slate-400 ring-2 ring-slate-100';

/* Estilos de badges para las tarjetas de próximos eventos */
const TYPE_BADGES = {
  evento: {
    bg: 'bg-blue-50/80',
    text: 'text-blue-700',
    border: 'border-blue-200/60',
    dot: 'bg-blue-500'
  },
  curso: {
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-700',
    border: 'border-emerald-200/60',
    dot: 'bg-emerald-500'
  },
  proyecto: {
    bg: 'bg-purple-50/80',
    text: 'text-purple-700',
    border: 'border-purple-200/60',
    dot: 'bg-purple-500'
  }
};

/* =========================================================================
   CAPA DE DATOS — llamada a la API y adaptación de la respuesta
   ========================================================================= */

function mapApiEventToCalendarEvent(apiEvent) {
  return {
    date: apiEvent.date,
    title: apiEvent.title,
    type: apiEvent.type
  };
}

async function fetchEvents(year) {
  if (CONFIG.USE_MOCK_DATA || !CONFIG.EVENTS_ENDPOINT) {
    return getMockEvents(year);
  }

  const { data } = await api.get(CONFIG.EVENTS_ENDPOINT, {
    params: { year }
  });

  return data.map(mapApiEventToCalendarEvent);
}

function getMockEvents(year) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          date: `${year}-01-15`,
          title: 'Kickoff de proyecto',
          type: 'proyecto'
        },
        {
          date: `${year}-02-10`,
          title: 'Webinar de seguridad',
          type: 'evento'
        },
        {
          date: `${year}-02-24`,
          title: 'Curso de Python',
          type: 'curso'
        },
        {
          date: `${year}-03-05`,
          title: 'Lanzamiento interno',
          type: 'evento'
        },
        {
          date: `${year}-04-18`,
          title: 'Curso de liderazgo',
          type: 'curso'
        },
        {
          date: `${year}-06-02`,
          title: 'Revisión de proyecto Q2',
          type: 'proyecto'
        },
        {
          date: `${year}-08-20`,
          title: 'Conferencia anual',
          type: 'evento'
        }
      ]);
    }, 900);
  });
}

/* =========================================================================
   ESTADOS DE UI: skeleton, error y contenido real
   ========================================================================= */

let grid;
let errorBanner;
let errorMessage;
let retryBtn;

function renderSkeleton() {
  grid.innerHTML = "";

  const card = document.createElement("div");

  card.className =
    "bg-white border border-slate-100 rounded-3xl p-6 shadow-sm animate-pulse max-w-sm mx-auto";

  const titleSkeleton = document.createElement("div");
  titleSkeleton.className =
    "h-4 w-32 bg-slate-200 rounded-md mx-auto mb-6";

  const weekSkeleton = document.createElement("div");
  weekSkeleton.className =
    "grid grid-cols-7 gap-2 mb-3";

  for (let i = 0; i < 7; i++) {
    const item = document.createElement("div");
    item.className = "h-3 bg-slate-200 rounded";
    weekSkeleton.appendChild(item);
  }

  const daysSkeleton = document.createElement("div");
  daysSkeleton.className =
    "grid grid-cols-7 gap-2";

  for (let i = 0; i < 35; i++) {
    const item = document.createElement("div");
    item.className =
      "h-9 bg-slate-100 rounded-2xl";

    daysSkeleton.appendChild(item);
  }

  card.appendChild(titleSkeleton);
  card.appendChild(weekSkeleton);
  card.appendChild(daysSkeleton);

  grid.appendChild(card);
}

function renderError(message) {
  if (!errorMessage || !errorBanner) return;

  errorMessage.textContent = message;
  errorBanner.classList.remove("hidden");
}

function hideError() {
  if (!errorBanner) return;

  errorBanner.classList.add("hidden");
}

/* =========================================================================
   CALENDARIO
   ========================================================================= */

function renderCalendar(eventsByDate) {
  grid.innerHTML = "";

  const {
    year,
    month,
    day: currentDayNum
  } = getCurrentDate();

  /*
   * Las semanas ahora se generan dinámicamente
   * utilizando el objeto Date de JavaScript.
   */
  const weeks = generateMonthWeeks(year, month);

  /* Tarjeta contenedora */
  const card = document.createElement("div");

  card.className =
    "relative bg-white border border-slate-100 rounded-3xl p-6 pt-7 shadow-lg shadow-slate-200/60 max-w-sm mx-auto transition-all overflow-hidden";

  /* Barra de acento superior */
  const accentBar = document.createElement("div");

  accentBar.className =
    "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-500";

  card.appendChild(accentBar);

  /* Encabezado del mes */
  const header = document.createElement("div");

  header.className =
    "flex items-center justify-between mb-5 pb-3 border-b border-slate-100";

  const title = document.createElement("h3");

  title.className =
    "text-sm font-bold text-slate-800 tracking-wide flex items-center gap-2";

  const titleDot = document.createElement("span");

  titleDot.className =
    "w-2 h-2 rounded-full bg-indigo-500 inline-block shadow-sm shadow-indigo-200";

  /*
   * Se utiliza textContent para evitar inyectar datos mediante HTML.
   */
  const monthText = document.createTextNode(monthsEs[month]);

  title.appendChild(titleDot);
  title.appendChild(monthText);

  const yearBadge = document.createElement("span");

  yearBadge.className =
    "text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100";

  yearBadge.textContent = year;

  header.appendChild(title);
  header.appendChild(yearBadge);

  card.appendChild(header);

  /* Tabla */
  const table = document.createElement("table");

  table.className =
    "w-full text-center border-separate border-spacing-y-1.5";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  weekDays.forEach((dayName, idx) => {
    const th = document.createElement("th");

    const isWeekend = idx === 0 || idx === 6;

    th.className =
      `text-[11px] font-semibold uppercase tracking-wider pb-2 ${
        isWeekend
          ? "text-indigo-300"
          : "text-slate-400"
      }`;

    th.textContent = dayName;

    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  weeks.forEach(week => {
    const row = document.createElement("tr");

    week.forEach((day, idx) => {
      const td = document.createElement("td");

      td.className =
        "p-0 text-center align-middle";

      if (day !== null) {
        const dateKey =
          `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dayEvents =
          eventsByDate[dateKey] || [];

        const isToday =
          day === currentDayNum;

        const isWeekend =
          idx === 0 || idx === 6;

        const wrapper =
          document.createElement("div");

        wrapper.className =
          `group relative flex flex-col items-center justify-center h-10 w-10 mx-auto rounded-2xl text-xs font-medium transition-all duration-150 cursor-pointer ${
            isToday
              ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold shadow-md shadow-indigo-200 ring-2 ring-indigo-100 scale-105"
              : isWeekend
                ? "text-indigo-300 hover:bg-indigo-50 hover:text-indigo-500 hover:scale-105"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:scale-105"
          }`;

        /*
         * Marcamos cada día con su fecha (dateKey) para poder
         * capturarlo mediante delegación de eventos desde
         * calendarDetails.js, sin agregar un listener por día.
         */
        wrapper.dataset.calendarDate = dateKey;
        wrapper.setAttribute("role", "button");
        wrapper.setAttribute("tabindex", "0");
        wrapper.setAttribute(
          "aria-label",
          `Ver actividades del ${day} de ${monthsEs[month]}`
        );

        const num = document.createElement("span");

        num.textContent = day;

        wrapper.appendChild(num);

        if (dayEvents.length > 0) {
          const dotsWrap =
            document.createElement("span");

          dotsWrap.className =
            `absolute -bottom-0.5 flex items-center gap-0.5 ${
              isToday ? "opacity-90" : ""
            }`;

          /*
           * title también recibe información proveniente
           * de los eventos, por lo que se mantiene como
           * atributo de texto y no como HTML.
           */
          dotsWrap.title =
            dayEvents
              .map(event => event.title)
              .join(", ");

          dayEvents
            .slice(0, 3)
            .forEach(event => {
              const dot =
                document.createElement("span");

              const colorClass =
                EVENT_TYPE_COLORS[event.type] ||
                DEFAULT_DOT_COLOR;

              dot.className =
                `w-1.5 h-1.5 rounded-full ${
                  isToday
                    ? "bg-white"
                    : colorClass
                }`;

              dotsWrap.appendChild(dot);
            });

          wrapper.appendChild(dotsWrap);
        }

        td.appendChild(wrapper);
      }

      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  card.appendChild(table);

  /* =========================================================================
     Leyenda de tipos de evento presentes este mes
     ========================================================================= */

  const typesPresent = new Set();

  Object.values(eventsByDate)
    .forEach(events => {
      events.forEach(event => {
        typesPresent.add(event.type);
      });
    });

  if (typesPresent.size > 0) {
    const legend = document.createElement("div");

    legend.className =
      "flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-5 pt-4 border-t border-slate-100";

    typesPresent.forEach(type => {
      const item =
        document.createElement("span");

      item.className =
        "flex items-center gap-1.5 text-[11px] text-slate-500 font-medium";

      const dot =
        document.createElement("span");

      const colorClass =
        EVENT_TYPE_COLORS[type] ||
        DEFAULT_DOT_COLOR;

      dot.className =
        `w-1.5 h-1.5 rounded-full inline-block ${colorClass}`;

      /*
       * El tipo se inserta como texto, no mediante innerHTML.
       */
      const typeText =
        document.createTextNode(type);

      item.appendChild(dot);
      item.appendChild(typeText);

      legend.appendChild(item);
    });

    card.appendChild(legend);
  }

  grid.appendChild(card);
}

/* =========================================================================
   Próximas fechas
   ========================================================================= */

function updateUpcomingLegend(events) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const formatter =
    new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short"
    });

  ["evento", "curso", "proyecto"]
    .forEach(type => {

      const next = events
        .filter(event =>
          event.type === type &&
          new Date(`${event.date}T00:00:00`) >= today
        )
        .sort(
          (a, b) =>
            new Date(a.date) - new Date(b.date)
        )[0];

      const label =
        document.getElementById(
          `upcoming-${type}`
        );

      if (!label) return;

      const style =
        TYPE_BADGES[type] || {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-400'
        };

      /* Limpia el contenido anterior */
      label.replaceChildren();

      if (next) {
        label.className =
          `inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${style.bg} ${style.text} ${style.border}`;

        /*
         * Se construye todo mediante la DOM API.
         * No se utiliza innerHTML para datos provenientes
         * de los eventos.
         */

        const dot =
          document.createElement("span");

        dot.className =
          `w-2 h-2 rounded-full ${style.dot}`;

        const content =
          document.createElement("span");

        const typeStrong =
          document.createElement("strong");

        typeStrong.textContent =
          `${type.toUpperCase()}: `;

        const titleText =
          document.createTextNode(
            next.title
          );

        const separator =
          document.createTextNode(" — ");

        const dateText =
          document.createElement("span");

        dateText.className =
          "opacity-80";

        dateText.textContent =
          formatter.format(
            new Date(`${next.date}T00:00:00`)
          );

        content.appendChild(typeStrong);
        content.appendChild(titleText);
        content.appendChild(separator);
        content.appendChild(dateText);

        label.appendChild(dot);
        label.appendChild(content);

      } else {
        label.className =
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border bg-slate-50 text-slate-400 border-slate-100";

        const dot =
          document.createElement("span");

        dot.className =
          "w-2 h-2 rounded-full bg-slate-300";

        const content =
          document.createElement("span");

        const typeStrong =
          document.createElement("strong");

        typeStrong.textContent =
          `${type.toUpperCase()}: `;

        const message =
          document.createTextNode(
            "Sin fecha próxima"
          );

        content.appendChild(typeStrong);
        content.appendChild(message);

        label.appendChild(dot);
        label.appendChild(content);
      }
    });
}

/* =========================================================================
   Orquestación: loading -> success/error
   ========================================================================= */

async function loadCalendar() {
  hideError();
  renderSkeleton();

  try {
    const { year } = getCurrentDate();

    const events =
      await fetchEvents(year);

    const eventsByDate = {};

    events.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }

      eventsByDate[event.date].push(event);
    });

    renderCalendar(eventsByDate);
    updateUpcomingLegend(events);
    updateCalendarDetails(events);

  } catch (err) {
    const status =
      err?.response?.status;

    if (status === 401 || status === 403) {
      return;
    }

    console.error(err);

    renderError(
      "No se pudieron cargar los eventos del calendario. Verifica tu conexión e inténtalo de nuevo."
    );

    renderCalendar({});
    updateCalendarDetails([]);
  }
}

/* =========================================================================
   Inicialización
   ========================================================================= */

export function initCalendar() {
  grid =
    document.getElementById("calendar-grid");

  errorBanner =
    document.getElementById("error-banner");

  errorMessage =
    document.getElementById("error-message");

  retryBtn =
    document.getElementById("retry-btn");

  if (!grid) {
    console.warn(
      "initCalendar(): no se encontró #calendar-grid en el DOM."
    );

    return;
  }

  if (retryBtn) {
    retryBtn.addEventListener(
      "click",
      loadCalendar
    );
  }

  // Se inicializa una sola vez (no en cada loadCalendar/reintentar)
  // para no duplicar el listener delegado.
  initCalendarDetails(grid, []);

  loadCalendar();
}