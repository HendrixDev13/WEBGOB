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
      oficioNo: "435-2026",
      referencia: "ELMM/gcchg",
      fecha: "3 de agosto de 2026",
      dirigidoA: "Ing. Mynor Alexander Chén Cujá — Gobernador Departamental, Presidente del CODEDEBV",
      asunto: "Informe mensual del proyecto \"Transparencia CODEDE\" de la Comisión Nacional Contra la Corrupción, correspondiente a julio de 2026.",
      pdf: "/assets/pdf/pdf-transparencia-codede/Ofi-2026InfoCODEDEjulio.pdf",
      municipios: [
        { nombre: "Salamá",            obras: 10, aporteCodede: 25845858, montoRecibido: 22057005.62, saldoRecibido: 3788852.38, montoEntregado: 21562005.62, saldoEntregado: 495000.00 },
        { nombre: "San Miguel Chicaj", obras: 9,  aporteCodede: 17365790, montoRecibido: 17365790.00, saldoRecibido: 0,          montoEntregado: 17365790.00, saldoEntregado: 0 },
        { nombre: "Rabinal",           obras: 8,  aporteCodede: 18473299, montoRecibido: 18359299.00, saldoRecibido: 114000.00,  montoEntregado: 18359299.00, saldoEntregado: 0 },
        { nombre: "Cubulco",           obras: 12, aporteCodede: 19203483, montoRecibido: 18175425.32, saldoRecibido: 1028057.68, montoEntregado: 18091925.32, saldoEntregado: 83500.00 },
        { nombre: "Granados",          obras: 15, aporteCodede: 10277693, montoRecibido: 10277693.00, saldoRecibido: 0,          montoEntregado: 10277693.00, saldoEntregado: 0 },
        { nombre: "El Chol",           obras: 5,  aporteCodede: 9494045,  montoRecibido: 9116035.90,  saldoRecibido: 378009.10,  montoEntregado: 9116035.90,  saldoEntregado: 0 },
        { nombre: "San Jerónimo",      obras: 5,  aporteCodede: 11636952, montoRecibido: 11310952.00, saldoRecibido: 325000.00,  montoEntregado: 10582074.99, saldoEntregado: 728877.01 },
        { nombre: "Purulhá",           obras: 9,  aporteCodede: 20033704, montoRecibido: 18296154.00, saldoRecibido: 1737550.00, montoEntregado: 18296154.00, saldoEntregado: 0 }
      ]
    }
    /* Cuando tengas el informe de agosto 2026, agrégalo aquí mismo,
       dentro del arreglo "2026", con una coma antes:

    ,{
      id: "2026-08",
      mesLabel: "Agosto 2026",
      oficioNo: "...",
      referencia: "...",
      fecha: "...",
      dirigidoA: "...",
      asunto: "...",
      pdf: "/assets/pdf/pdf-transparencia-codede/nombre-del-archivo.pdf",
      municipios: [ ... ]
    }
    */
  ],

  /* ---------------------------------------------------------
     AÑOS ANTERIORES
     Deja el arreglo vacío [] hasta que subas los PDFs y datos
     de ese año. El panel lateral igual muestra el año como
     sección, y a la derecha aparece un aviso de "aún no hay
     informes cargados" en vez de romperse.

     Para agregar un mes de 2025, copia la estructura completa
     del ejemplo de julio 2026 (arriba) dentro de este arreglo.
  ------------------------------------------------------------ */
  2025: [],
  2024: []
};

function formatoQ(numero) {
  return "Q " + numero.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---- Panel lateral: años como acordeón, meses como lista ---- */
function renderHistorial(idActivo) {
  const contenedor = document.getElementById("historialInformes");
  if (!contenedor) return;

  const anios = Object.keys(historialInformes).sort((a, b) => b - a); // más reciente primero

  contenedor.innerHTML = anios.map(anio => {
    const informesDelAnio = historialInformes[anio];
    const abierto = informesDelAnio.some(inf => inf.id === idActivo) || anio === anios[0];

    const listaMeses = informesDelAnio.length
      ? informesDelAnio.map(inf => `
          <li>
            <button class="item-informe ${inf.id === idActivo ? "activo" : ""}" data-id="${inf.id}">
              ${inf.mesLabel}
            </button>
          </li>
        `).join("")
      : `<li class="sin-informes">Aún no hay informes cargados</li>`;

    return `
      <div class="anio-historial ${abierto ? "abierto" : ""}">
        <button class="anio-toggle" data-anio="${anio}">
          <span>${anio}</span>
          <span class="flecha">▾</span>
        </button>
        <ul class="lista-meses">${listaMeses}</ul>
      </div>
    `;
  }).join("");

  // Expandir / colapsar año
  contenedor.querySelectorAll(".anio-toggle").forEach(boton => {
    boton.addEventListener("click", () => {
      boton.closest(".anio-historial").classList.toggle("abierto");
    });
  });

  // Seleccionar un mes
  contenedor.querySelectorAll(".item-informe").forEach(boton => {
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
  document.getElementById("oficioNo").textContent = informe.oficioNo;
  document.getElementById("oficioReferencia").textContent = informe.referencia;
  document.getElementById("oficioFecha").textContent = informe.fecha;
  document.getElementById("oficioDirigidoA").textContent = informe.dirigidoA;
  document.getElementById("oficioAsunto").textContent = informe.asunto;

  document.getElementById("btnVerPdf").setAttribute("href", informe.pdf);
  document.getElementById("btnDescargarPdf").setAttribute("href", informe.pdf);
  document.getElementById("visorPdf").setAttribute("src", informe.pdf);
}

function renderTablaResumen(informe) {
  const tbody = document.getElementById("cuerpoTablaResumen");
  const tfoot = document.getElementById("pieTablaResumen");
  if (!tbody || !tfoot) return;

  tbody.innerHTML = informe.municipios.map(m => `
    <tr>
      <td>${m.nombre}</td>
      <td>${m.obras}</td>
      <td>${formatoQ(m.aporteCodede)}</td>
      <td>${formatoQ(m.montoRecibido)}</td>
      <td>${formatoQ(m.saldoRecibido)}</td>
      <td>${formatoQ(m.montoEntregado)}</td>
      <td>${formatoQ(m.saldoEntregado)}</td>
    </tr>
  `).join("");

  const totales = informe.municipios.reduce((acc, m) => {
    acc.obras += m.obras;
    acc.aporteCodede += m.aporteCodede;
    acc.montoRecibido += m.montoRecibido;
    acc.saldoRecibido += m.saldoRecibido;
    acc.montoEntregado += m.montoEntregado;
    acc.saldoEntregado += m.saldoEntregado;
    return acc;
  }, { obras: 0, aporteCodede: 0, montoRecibido: 0, saldoRecibido: 0, montoEntregado: 0, saldoEntregado: 0 });

  tfoot.innerHTML = `
    <tr>
      <td>Total departamental</td>
      <td>${totales.obras}</td>
      <td>${formatoQ(totales.aporteCodede)}</td>
      <td>${formatoQ(totales.montoRecibido)}</td>
      <td>${formatoQ(totales.saldoRecibido)}</td>
      <td>${formatoQ(totales.montoEntregado)}</td>
      <td>${formatoQ(totales.saldoEntregado)}</td>
    </tr>
  `;
}

/* ---- Gráfica de barras horizontales, dibujada a mano en <canvas> ---- */
function renderGrafica(informe) {
  const canvas = document.getElementById("graficaAporte");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  const anchoCss = canvas.clientWidth || 700;
  const altoCss = 60 + informe.municipios.length * 46;
  canvas.width = anchoCss * dpr;
  canvas.height = altoCss * dpr;
  canvas.style.height = altoCss + "px";
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, anchoCss, altoCss);

  const datos = [...informe.municipios].sort((a, b) => b.aporteCodede - a.aporteCodede);
  const maximo = Math.max(...datos.map(d => d.aporteCodede));

  const margenIzq = 150;
  const margenDer = 110;
  const anchoBarras = anchoCss - margenIzq - margenDer;
  const altoBarra = 26;
  const espacio = 46;

  datos.forEach((d, i) => {
    const y = 20 + i * espacio;
    const largo = (d.aporteCodede / maximo) * anchoBarras;

    ctx.fillStyle = "#2a2116";
    ctx.textAlign = "right";
    ctx.font = "600 12px Inter, sans-serif";
    ctx.fillText(d.nombre, margenIzq - 14, y + altoBarra / 2 + 4);

    ctx.fillStyle = "#eef1f8";
    ctx.fillRect(margenIzq, y, anchoBarras, altoBarra);

    const gradiente = ctx.createLinearGradient(margenIzq, 0, margenIzq + largo, 0);
    gradiente.addColorStop(0, "#2f5fd6");
    gradiente.addColorStop(1, "#0f2c66");
    ctx.fillStyle = gradiente;
    ctx.fillRect(margenIzq, y, largo, altoBarra);

    ctx.fillStyle = "#4b5568";
    ctx.textAlign = "left";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(
      "Q " + Math.round(d.aporteCodede).toLocaleString("es-GT"),
      margenIzq + largo + 10,
      y + altoBarra / 2 + 4
    );
  });
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
  renderTablaResumen(informe);
  renderGrafica(informe);
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

  window.addEventListener("resize", () => {
    const activo = obtenerInformePorId(location.hash.replace("#", "")) || informeInicial;
    renderGrafica(activo);
  });
});