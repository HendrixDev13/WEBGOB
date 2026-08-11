/* =====================================================
   TRANSPARENCIA.JS
   Datos y lógica de la página de Transparencia de Información:
   - Historial de informes agrupado por año (panel lateral)
   - Al seleccionar un mes: tarjeta de oficio, visor de PDF,
     tabla resumen por municipio y gráfica de barras (canvas puro)

   Fuente de los montos del informe 2026-07: Oficio No. 435-2026,
   CODEDEBV, "Aporte a los Consejos Departamentales de Desarrollo,
   Ejecución física y financiera al 31 de julio de 2026".
===================================================== */

const historialInformes = {
  2026: [
    {
      id: "2026-07",
      mesLabel: "Julio 2026",
      pdf: "/assets/pdf/pdf-transparencia-codede/Ofi-2026InfoCODEDEjulio.pdf",
    },
    {
      id: "2026-06",
      mesLabel: "Junio 2026",
      pdf: "/assets/pdf/pdf-transparencia-codede/Ofi-2026InfoCODEDEjunio.pdf",
    },
    {
      id: "2026-05",
      mesLabel: "Mayo 2026",
      pdf: "/assets/pdf/pdf-transparencia-codede/Ofi-2026InfoCODEDEmayo.pdf",
    },
    {
      id: "2026-04",
      mesLabel: "Abril 2026",
      pdf: "/assets/pdf/pdf-transparencia-codede/Ofi-2026InfoCODEDEabril.pdf",
    },
    {
      id: "2026-03",
      mesLabel: "Marzo 2026",
      pdf: "/assets/pdf/pdf-transparencia-codede/Ofi-2026InfoCODEDEmarzo.pdf",
    }

  ],

  2025: [],
  2024: []
};

function formatoQ(numero) {
  return "Q " + numero.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---- Historial como módulo de años con meses ---- */
function renderHistorial(idActivo) {
  const contenedor = document.getElementById("historialInformes");
  if (!contenedor) return;

  const anios = Object.keys(historialInformes).sort((a, b) => b - a); // más reciente primero

  contenedor.innerHTML = anios.map(anio => {
    const informesDelAnio = historialInformes[anio];
    if (!informesDelAnio.length) return "";

    const meses = informesDelAnio.map(inf => `
      <button class="mes-button ${inf.id === idActivo ? "activo" : ""}" data-id="${inf.id}">
        ${inf.mesLabel || inf.mes || inf.id}
      </button>
    `).join("");

    const abierto = informesDelAnio.some(inf => inf.id === idActivo);

    return `
      <div class="anio-card ${abierto ? "abierto" : ""}">
        <button class="anio-card-header" type="button" data-anio="${anio}">
          <div>
            <span class="anio-title">${anio}</span>
          </div>
          <span class="anio-chevron">▾</span>
        </button>
        <div class="meses-wrap">${meses}</div>
      </div>
    `;
  }).join("");

  contenedor.querySelectorAll(".anio-card-header").forEach(boton => {
    boton.addEventListener("click", () => {
      boton.closest(".anio-card").classList.toggle("abierto");
    });
  });

  contenedor.querySelectorAll(".mes-button").forEach(boton => {
    boton.addEventListener("click", () => renderInforme(boton.dataset.id));
  });
}

function obtenerInformePorId(id) {
  for (const anio in historialInformes) {
    const encontrado = historialInformes[anio].find(inf => inf.id === id);
    if (encontrado) return encontrado;
  }
  return null;
}

function primerInformeDisponible() {
  const anios = Object.keys(historialInformes).sort((a, b) => b - a);
  for (const anio of anios) {
    if (historialInformes[anio].length) return historialInformes[anio][0];
  }
  return null;
}

function renderTarjetaOficio(informe) {
  document.getElementById("btnVerPdf").setAttribute("href", informe.pdf);
  document.getElementById("btnDescargarPdf").setAttribute("href", informe.pdf);
  document.getElementById("visorPdf").setAttribute("src", informe.pdf);
}

function mostrarSinInformes() {
  document.getElementById("panelInforme").style.display = "none";
  document.getElementById("panelVacio").style.display = "flex";
}

function renderInforme(id) {
  const informe = obtenerInformePorId(id);

  if (!informe) {
    mostrarSinInformes();
    return;
  }

  document.getElementById("panelInforme").style.display = "";
  document.getElementById("panelVacio").style.display = "none";

  renderTarjetaOficio(informe);
  renderHistorial(id);

  history.replaceState(null, "", `#${id}`);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("historialInformes")) return; // solo corre en trans-codede.html

  const hash = location.hash.replace("#", "");
  const informeInicial = obtenerInformePorId(hash) || primerInformeDisponible();

  if (!informeInicial) {
    renderHistorial(null);
    mostrarSinInformes();
    return;
  }

  renderInforme(informeInicial.id);
});