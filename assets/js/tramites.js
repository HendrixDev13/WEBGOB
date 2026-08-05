/* =====================================================
   TRAMITES.JS
   Datos y lógica de la página de trámites:
   - Array `tramites` con la información de cada uno
   - Renderiza el listado izquierdo
   - Al hacer clic, muestra instrucciones/requisitos a la
     derecha y habilita el botón de descarga del PDF
===================================================== */

const tramites = [
  {
    id: 1,
    nombre: "Formulario de autorización de actividades en la vía pública",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "Complételo con letra clara y sin tachones.",
      "Preséntelo en Secretaría de la Gobernación en horario de oficina."
    ],
    requisitos: [
      "Fotocopia de DPI del solicitante.",
      "Descripción de la actividad a realizar.",
      "Fecha, horario y duración estimada de la actividad.",
      "Croquis o dirección exacta del lugar."
    ]
  },
  {
    id: 2,
    nombre: "Formulario de recolección de rifas y sorteos",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "Reúna las firmas de aval de los organizadores de la rifa.",
      "Preséntelo en Secretaría junto con los requisitos solicitados."
    ],
    requisitos: [
      "Fotocopia de DPI del responsable de la rifa.",
      "Listado de premios a sortear.",
      "Firmas de aval de los organizadores.",
      "Fecha programada del sorteo."
    ]
  }

  /* ---------------------------------------------------------
     PARA AGREGAR TUS PRÓXIMOS 15 TRÁMITES, copia este bloque,
     pégalo después del último elemento (con una coma antes),
     y cambia los datos:

  ,{
    id: 3,
    nombre: "Nombre del trámite",
    pdf: "assets/pdf/03-nombre-del-archivo.pdf",
    instrucciones: [
      "Paso 1...",
      "Paso 2...",
      "Paso 3..."
    ],
    requisitos: [
      "Requisito 1...",
      "Requisito 2..."
    ]
  }

  ------------------------------------------------------------ */
];

function renderListaTramites() {
  const lista = document.getElementById('listaTramites');
  if (!lista) return;

  lista.innerHTML = tramites.map(t => `
    <li>
      <button class="item-tramite" data-id="${t.id}">
        <span class="numero">${t.id}</span>
        <span>${t.nombre}</span>
      </button>
    </li>
  `).join('');

  lista.querySelectorAll('.item-tramite').forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.dataset.id, 10);
      mostrarTramite(id);
    });
  });
}

function mostrarTramite(id) {
  const tramite = tramites.find(t => t.id === id);
  const detalle = document.getElementById('detalleTramite');
  if (!tramite || !detalle) return;

  // Marcar el botón activo en el listado
  document.querySelectorAll('.item-tramite').forEach(b => {
    b.classList.toggle('activo', parseInt(b.dataset.id, 10) === id);
  });

  detalle.innerHTML = `
    <span class="ojo">Trámite ${tramite.id}</span>
    <h2>${tramite.nombre}</h2>

    <h4>Instrucciones</h4>
    <ol>
      ${tramite.instrucciones.map(paso => `<li>${paso}</li>`).join('')}
    </ol>

    <h4>Requisitos</h4>
    <ul class="lista-requisitos">
      ${tramite.requisitos.map(req => `<li>${req}</li>`).join('')}
    </ul>

    <a href="${tramite.pdf}" class="btn-descarga" download>
      ⬇ Descargar formulario (PDF)
    </a>
  `;

  // Permite compartir/recargar en el mismo trámite
  history.replaceState(null, '', `#tramite-${id}`);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('listaTramites')) return; // solo corre en tramites.html

  renderListaTramites();

  // Si la URL trae un hash (#tramite-3), abre ese trámite directamente
  const hash = location.hash.match(/tramite-(\d+)/);
  const idInicial = hash ? parseInt(hash[1], 10) : tramites[0].id;
  mostrarTramite(idInicial);
});