(function () {
  'use strict';

  const RUTA_DATOS = 'assets/pdf/pdf-tableroelectronico/data/';
  const RUTA_PDF = 'assets/pdf/pdf-tableroelectronico/pdf/';
  const ARCHIVO_PERIODOS = 'periodos.json';
  const DESCRIPCIONES_PROGRAMAS = Object.freeze({
    '001': 'Gestiones administrativas y servicios realizados en la Gobernación Departamental de Baja Verapaz, para el desarrollo de sus funciones operativas.',
    '002': 'Emisión de declaraciones juradas de sobrevivencia del FOPINDE e IPM, y constancias sobre trámites de las diferentes pensiones de Clases Pasivas del Estado.'
  });
  const RENGLONES_SERVICIOS = Object.freeze([
    { codigos: ['011'], etiqueta: 'Personal permanente 011' },
    {
      codigos: ['021', '022', '031'],
      etiqueta: 'Personal Temporal 021\nPersonal Temporal 022\nJornales 031'
    },
    { codigos: ['029'], etiqueta: 'Servicios Técnicos o Profesionales 029' },
    { codigos: ['018'], etiqueta: 'Servicios Técnicos o Profesionales Subgrupo 18' }
  ]);

  const formatoMoneda = new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formatoNumero = new Intl.NumberFormat('es-GT');

  const elementos = {
    selectorAnio: document.querySelector('#selector-anio'),
    selectorMes: document.querySelector('#selector-mes'),
    estado: document.querySelector('#tablero-estado'),
    contenido: document.querySelector('#tablero-contenido'),
    fechaCorte: document.querySelector('#fecha-corte'),
    periodoVisible: document.querySelector('#periodo-visible'),
    presupuestoVigente: document.querySelector('#presupuesto-vigente'),
    presupuestoEjecutado: document.querySelector('#presupuesto-ejecutado'),
    presupuestoPorcentaje: document.querySelector('#presupuesto-porcentaje'),
    graficaEjecucion: document.querySelector('#grafica-ejecucion'),
    anilloPorcentaje: document.querySelector('#anillo-porcentaje'),
    gruposGasto: document.querySelector('#lista-grupos-gasto'),
    personalPresupuesto: document.querySelector('#personal-presupuesto'),
    personalEjecutado: document.querySelector('#personal-ejecutado'),
    personalPorcentaje: document.querySelector('#personal-porcentaje'),
    personas: document.querySelector('#lista-personas'),
    programas: document.querySelector('#tabla-programas'),
    avances: document.querySelector('#lista-avances'),
    aniosReportes: document.querySelector('#lista-anios-reportes'),
    reportesPdf: document.querySelector('#lista-reportes-pdf')
  };

  let solicitudActual = null;

  function esNumero(valor) {
    return typeof valor === 'number' && Number.isFinite(valor);
  }

  function esNombrePdfSeguro(nombre) {
    return typeof nombre === 'string'
      && nombre.length > 4
      && !nombre.includes('/')
      && !nombre.includes('\\')
      && nombre.toLowerCase().endsWith('.pdf');
  }

  function limitarPorcentaje(valor) {
    const porcentaje = esNumero(valor) ? valor * 100 : 0;
    return Math.min(100, Math.max(0, porcentaje));
  }

  function moneda(valor) {
    return formatoMoneda.format(esNumero(valor) ? valor : 0);
  }

  function porcentaje(valor) {
    return `${limitarPorcentaje(valor).toFixed(2)}%`;
  }

  function numero(valor) {
    return formatoNumero.format(esNumero(valor) ? valor : 0);
  }

  function fechaLegible(fechaIso) {
    if (typeof fechaIso !== 'string') return 'Fecha de corte no disponible';

    const partes = fechaIso.split('-').map(Number);
    if (partes.length !== 3 || partes.some((parte) => !Number.isInteger(parte))) {
      return 'Fecha de corte no disponible';
    }

    const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
    return `Datos al ${new Intl.DateTimeFormat('es-GT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha)}`;
  }

  function mostrarEstado(mensaje, tipo = 'carga') {
    elementos.estado.textContent = mensaje;
    elementos.estado.dataset.tipo = tipo;
    elementos.estado.hidden = false;
  }

  function ocultarEstado() {
    elementos.estado.hidden = true;
    delete elementos.estado.dataset.tipo;
  }

  async function obtenerJson(archivo, signal) {
    const respuesta = await fetch(`${RUTA_DATOS}${archivo}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal
    });

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar ${archivo} (${respuesta.status}).`);
    }

    return respuesta.json();
  }

  function validarIndice(datos) {
    return datos
      && Array.isArray(datos.periodos)
      && datos.periodos.length > 0
      && datos.periodos.every((periodo) => periodo.id
        && periodo.archivo
        && esNombrePdfSeguro(periodo.pdf)
        && periodo.etiqueta
        && Number.isInteger(periodo.anio)
        && Number.isInteger(periodo.mesNumero)
        && periodo.mesNumero >= 1
        && periodo.mesNumero <= 12);
  }

  function validarPeriodo(datos) {
    return datos
      && datos.periodo
      && datos.presupuesto
      && Array.isArray(datos.gruposGasto)
      && datos.serviciosPersonales
      && Array.isArray(datos.programas)
      && Array.isArray(datos.avances);
  }

  function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }

  function renderizarGrupos(grupos, totalEjecutado) {
    const fragmento = document.createDocumentFragment();

    grupos.forEach((grupo) => {
      const participacion = totalEjecutado > 0 && esNumero(grupo.ejecutado)
        ? grupo.ejecutado / totalEjecutado
        : 0;
      const item = crearElemento('div', 'tablero-barra');
      const cabecera = crearElemento('div', 'tablero-barra-cabecera');
      const nombre = crearElemento('span');
      const codigo = crearElemento('span', 'tablero-codigo', grupo.codigo || '—');
      const valor = crearElemento('strong', '', moneda(grupo.ejecutado));
      const pista = crearElemento('div', 'tablero-barra-pista');
      const barra = crearElemento('span');
      const detalle = crearElemento(
        'small',
        'tablero-barra-detalle',
        `${porcentaje(participacion)} del total ejecutado`
      );

      nombre.append(codigo, document.createTextNode(grupo.nombre || 'Grupo sin nombre'));
      cabecera.append(nombre, valor);
      barra.style.setProperty('--ancho', `${limitarPorcentaje(participacion)}%`);
      pista.append(barra);
      item.append(cabecera, pista, detalle);
      fragmento.append(item);
    });

    elementos.gruposGasto.replaceChildren(fragmento);
  }

  function renderizarPersonas(personas) {
    const fragmento = document.createDocumentFragment();
    elementos.personas.querySelectorAll('[data-renglon-servicio]').forEach((item) => item.remove());

    RENGLONES_SERVICIOS.forEach(({ codigos, etiqueta }) => {
      const cantidades = codigos
        .map((codigo) => personas && personas[codigo])
        .filter(esNumero);
      const cantidad = cantidades.length > 0
        ? cantidades.reduce((total, valorActual) => total + valorActual, 0)
        : null;
      const valor = cantidad === null
        ? 'N/A'
        : `${numero(cantidad)} ${cantidad === 1 ? 'persona' : 'personas'}`;
      const item = crearElemento('div', 'tablero-persona');
      item.dataset.renglonServicio = '';
      item.append(
        crearElemento('dt', '', etiqueta),
        crearElemento('dd', 'badge rounded-pill', valor)
      );
      fragmento.append(item);
    });

    elementos.personas.append(fragmento);
  }

  function renderizarProgramas(programas) {
    const fragmento = document.createDocumentFragment();

    programas.forEach((programa) => {
      const fila = document.createElement('tr');
      const celdaNombre = crearElemento('td', 'tablero-programa-nombre');
      const codigo = crearElemento('span', '', programa.codigo || '—');
      const celdaPorcentaje = document.createElement('td');

      celdaNombre.append(codigo, document.createTextNode(programa.nombre || 'Programa sin nombre'));
      celdaPorcentaje.append(
        crearElemento('span', 'tablero-porcentaje-tabla', porcentaje(programa.porcentajeEjecucion))
      );
      fila.append(
        celdaNombre,
        crearElemento('td', '', DESCRIPCIONES_PROGRAMAS[programa.codigo] || '—'),
        crearElemento('td', '', moneda(programa.vigente)),
        crearElemento('td', '', moneda(programa.ejecutado)),
        celdaPorcentaje,
        crearElemento('td', '', numero(programa.metaEjecutada))
      );
      fragmento.append(fila);
    });

    elementos.programas.replaceChildren(fragmento);
  }

  function renderizarAvances(avances) {
    const fragmento = document.createDocumentFragment();

    avances.forEach((avance) => {
      const tarjeta = crearElemento('article', 'card tablero-card tablero-avance');
      tarjeta.append(
        crearElemento('span', 'tablero-avance-codigo', avance.codigo || '—'),
        crearElemento('p', '', avance.texto || 'Sin descripción disponible.')
      );
      fragmento.append(tarjeta);
    });

    elementos.avances.replaceChildren(fragmento);
  }

  function renderizarDashboard(datos) {
    const { periodo, presupuesto, serviciosPersonales } = datos;
    const progresoGeneral = limitarPorcentaje(presupuesto.porcentajeEjecucion);

    elementos.fechaCorte.textContent = fechaLegible(periodo.fechaCorte);
    elementos.periodoVisible.textContent = "";
    // elementos.periodoVisible.textContent = "periodo.etiqueta || periodo.id";
    elementos.presupuestoVigente.textContent = moneda(presupuesto.vigente);
    elementos.presupuestoEjecutado.textContent = moneda(presupuesto.ejecutado);
    elementos.presupuestoPorcentaje.textContent = porcentaje(presupuesto.porcentajeEjecucion);
    elementos.anilloPorcentaje.textContent = porcentaje(presupuesto.porcentajeEjecucion);
    elementos.graficaEjecucion.style.setProperty('--progreso', progresoGeneral);
    elementos.graficaEjecucion.setAttribute(
      'aria-label',
      `Ejecución presupuestaria de ${porcentaje(presupuesto.porcentajeEjecucion)}`
    );
    renderizarGrupos(datos.gruposGasto, presupuesto.ejecutado);

    elementos.personalPresupuesto.textContent = moneda(serviciosPersonales.presupuesto);
    elementos.personalEjecutado.textContent = moneda(serviciosPersonales.ejecutado);
    elementos.personalPorcentaje.textContent = porcentaje(serviciosPersonales.porcentajeEjecucion);
    renderizarPersonas(serviciosPersonales.personas);
    // Secciones ocultas temporalmente en tableroelectronico.html.
    // renderizarProgramas(datos.programas);
    // renderizarAvances(datos.avances);

  }

  async function cargarPeriodo(periodo) {
    if (!periodo) return;

    if (solicitudActual) solicitudActual.abort();
    solicitudActual = new AbortController();
    const solicitud = solicitudActual;

    elementos.selectorAnio.disabled = true;
    elementos.selectorMes.disabled = true;
    elementos.contenido.hidden = true;
    mostrarEstado(`Cargando información de ${periodo.etiqueta}...`);

    try {
      const datos = await obtenerJson(periodo.archivo, solicitud.signal);
      if (!validarPeriodo(datos)) {
        throw new Error('El archivo mensual no contiene la estructura esperada.');
      }

      renderizarDashboard(datos);
      elementos.contenido.hidden = false;
      ocultarEstado();
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error cargando el período:', error);
      elementos.contenido.hidden = true;
      mostrarEstado(
        'No fue posible cargar la información de este período.'
      );
    } finally {
      if (solicitud === solicitudActual) {
        elementos.selectorAnio.disabled = false;
        elementos.selectorMes.disabled = false;
      }
    }
  }

  function actualizarUrl(periodoId) {
    const url = new URL(window.location.href);
    url.searchParams.set('periodo', periodoId);
    window.history.replaceState({}, '', url);
  }

  function prepararSelectores(indice) {
    const periodosOrdenados = [...indice.periodos].sort(
      (a, b) => b.anio - a.anio || b.mesNumero - a.mesNumero
    );
    const periodoUrl = new URLSearchParams(window.location.search).get('periodo');
    const periodoInicial = periodosOrdenados.find((periodo) => periodo.id === periodoUrl)
      || periodosOrdenados.find((periodo) => periodo.id === indice.ultimoPeriodo)
      || periodosOrdenados[0];
    const anios = [...new Set(periodosOrdenados.map((periodo) => periodo.anio))];

    const opcionesAnio = anios.map((anio) => {
      const opcion = document.createElement('option');
      opcion.value = String(anio);
      opcion.textContent = String(anio);
      return opcion;
    });

    function llenarMeses(anio, periodoPreferido) {
      const periodosDelAnio = periodosOrdenados.filter(
        (periodo) => periodo.anio === Number(anio)
      );
      const opcionesMes = periodosDelAnio.map((periodo) => {
        const opcion = document.createElement('option');
        opcion.value = periodo.id;
        opcion.textContent = periodo.mes || periodo.etiqueta;
        return opcion;
      });
      const periodoSeleccionado = periodosDelAnio.find(
        (periodo) => periodo.id === periodoPreferido
      ) || periodosDelAnio[0];

      elementos.selectorMes.replaceChildren(...opcionesMes);
      elementos.selectorMes.value = periodoSeleccionado.id;
      return periodoSeleccionado;
    }

    elementos.selectorAnio.replaceChildren(...opcionesAnio);
    elementos.selectorAnio.value = String(periodoInicial.anio);
    llenarMeses(periodoInicial.anio, periodoInicial.id);
    elementos.selectorAnio.disabled = false;
    elementos.selectorMes.disabled = false;

    elementos.selectorAnio.addEventListener('change', () => {
      const seleccionado = llenarMeses(elementos.selectorAnio.value);

      actualizarUrl(seleccionado.id);
      cargarPeriodo(seleccionado);
    });

    elementos.selectorMes.addEventListener('change', () => {
      const seleccionado = periodosOrdenados.find(
        (periodo) => periodo.id === elementos.selectorMes.value
      );
      if (!seleccionado) return;

      actualizarUrl(seleccionado.id);
      cargarPeriodo(seleccionado);
    });

    return periodoInicial;
  }

  function prepararNavegadorReportes(indice) {
    if (!elementos.aniosReportes || !elementos.reportesPdf) return;

    const periodosOrdenados = [...indice.periodos].sort(
      (a, b) => b.anio - a.anio || b.mesNumero - a.mesNumero
    );
    const anios = [...new Set(periodosOrdenados.map((periodo) => periodo.anio))];
    const fragmentoAnios = document.createDocumentFragment();

    function mostrarReportes(anio) {
      const fragmentoReportes = document.createDocumentFragment();
      const reportes = periodosOrdenados.filter((periodo) => periodo.anio === Number(anio));

      reportes.forEach((periodo, indiceReporte) => {
        const abierto = indiceReporte === 0;
        const idColapso = `reporte-pdf-${periodo.anio}-${periodo.mesNumero}`;
        const item = crearElemento('div', 'accordion-item');
        const encabezado = crearElemento('h3', 'accordion-header');
        const boton = crearElemento(
          'button',
          `accordion-button tablero-reporte-pdf${abierto ? '' : ' collapsed'}`
        );
        const contenido = crearElemento('span', 'tablero-reporte-pdf-contenido');
        const titulo = crearElemento('strong', '', periodo.etiqueta);
        const archivo = crearElemento('small', '', periodo.pdf);
        const tipo = crearElemento('span', 'badge', 'PDF');
        const colapso = crearElemento(
          'div',
          `accordion-collapse collapse${abierto ? ' show' : ''}`
        );
        const cuerpo = crearElemento('div', 'accordion-body tablero-reporte-pdf-cuerpo');
        const visor = crearElemento('iframe', 'tablero-visor-pdf');
        const rutaPdf = `${RUTA_PDF}${encodeURIComponent(periodo.pdf)}#view=Fit`;

        boton.type = 'button';
        boton.dataset.bsToggle = 'collapse';
        boton.dataset.bsTarget = `#${idColapso}`;
        boton.setAttribute('aria-expanded', String(abierto));
        boton.setAttribute('aria-controls', idColapso);
        colapso.id = idColapso;
        colapso.dataset.bsParent = '#lista-reportes-pdf';
        colapso.addEventListener('shown.bs.collapse', () => {
          boton.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
            block: 'start'
          });
        });
        visor.title = `Reporte ${periodo.etiqueta}`;
        visor.loading = abierto ? 'eager' : 'lazy';
        if (abierto) {
          visor.src = rutaPdf;
        } else {
          visor.dataset.src = rutaPdf;
          colapso.addEventListener('show.bs.collapse', () => {
            visor.src = visor.dataset.src;
            delete visor.dataset.src;
          }, { once: true });
        }
        contenido.append(titulo, archivo);
        boton.append(contenido, tipo);
        encabezado.append(boton);
        cuerpo.append(visor);
        colapso.append(cuerpo);
        item.append(encabezado, colapso);
        fragmentoReportes.append(item);
      });

      elementos.reportesPdf.replaceChildren(fragmentoReportes);
    }

    function seleccionarAnio(anio) {
      elementos.aniosReportes.querySelectorAll('[data-anio]').forEach((boton) => {
        const activo = Number(boton.dataset.anio) === Number(anio);
        boton.classList.toggle('active', activo);
        if (activo) boton.setAttribute('aria-current', 'true');
        else boton.removeAttribute('aria-current');
      });
      mostrarReportes(anio);
    }

    anios.forEach((anio) => {
      const boton = crearElemento(
        'button',
        'list-group-item list-group-item-action tablero-reporte-anio',
        anio
      );
      boton.type = 'button';
      boton.dataset.anio = String(anio);
      boton.addEventListener('click', () => seleccionarAnio(anio));
      fragmentoAnios.append(boton);
    });

    elementos.aniosReportes.replaceChildren(fragmentoAnios);
    seleccionarAnio(anios[0]);
  }

  async function iniciarDashboard() {
    if (!elementos.selectorAnio
      || !elementos.selectorMes
      || !elementos.estado
      || !elementos.contenido) return;

    try {
      const indice = await obtenerJson(ARCHIVO_PERIODOS);
      if (!validarIndice(indice)) {
        throw new Error(`${ARCHIVO_PERIODOS} no contiene períodos válidos.`);
      }

      const periodoInicial = prepararSelectores(indice);
      prepararNavegadorReportes(indice);
      await cargarPeriodo(periodoInicial);
    } catch (error) {
      console.error('Error iniciando el tablero:', error);
      elementos.selectorAnio.disabled = true;
      elementos.selectorMes.disabled = true;
      elementos.contenido.hidden = true;
      mostrarEstado(
        `No fue posible consultar los períodos disponibles. Verifica el archivo ${ARCHIVO_PERIODOS} y ejecuta el sitio mediante un servidor HTTP.`,
        'error'
      );
    }
  }

  iniciarDashboard();
}());
