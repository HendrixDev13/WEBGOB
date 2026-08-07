(function () {
  'use strict';

  const RUTA_DATOS = 'assets/pdf/pdf-tableroelectronico/data/';

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
    presupuestoSaldo: document.querySelector('#presupuesto-saldo'),
    presupuestoPorcentaje: document.querySelector('#presupuesto-porcentaje'),
    graficaEjecucion: document.querySelector('#grafica-ejecucion'),
    anilloPorcentaje: document.querySelector('#anillo-porcentaje'),
    balanceEjecutado: document.querySelector('#balance-ejecutado'),
    balanceDisponible: document.querySelector('#balance-disponible'),
    gruposGasto: document.querySelector('#lista-grupos-gasto'),
    finalidades: document.querySelector('#lista-finalidades'),
    personalPresupuesto: document.querySelector('#personal-presupuesto'),
    personalEjecutado: document.querySelector('#personal-ejecutado'),
    personalPorcentaje: document.querySelector('#personal-porcentaje'),
    personalBarra: document.querySelector('#personal-barra'),
    personas: document.querySelector('#lista-personas'),
    programas: document.querySelector('#tabla-programas'),
    avances: document.querySelector('#lista-avances'),
    fuenteTipo: document.querySelector('#fuente-tipo'),
    fuenteArchivo: document.querySelector('#fuente-archivo')
  };

  let solicitudActual = null;

  function esNumero(valor) {
    return typeof valor === 'number' && Number.isFinite(valor);
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
      && Array.isArray(datos.finalidades)
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

  function renderizarFinalidades(finalidades) {
    const fragmento = document.createDocumentFragment();

    finalidades.forEach((finalidad) => {
      const tarjeta = crearElemento('article', 'tablero-finalidad');
      const cabecera = crearElemento('div', 'tablero-finalidad-cabecera');
      const titulo = crearElemento(
        'h3',
        '',
        `${finalidad.codigo || '—'} · ${finalidad.nombre || 'Finalidad sin nombre'}`
      );
      const ejecucion = crearElemento(
        'span',
        'tablero-finalidad-porcentaje',
        porcentaje(finalidad.porcentajeEjecucion)
      );
      const detalle = document.createElement('dl');
      const vigente = document.createElement('div');
      const ejecutado = document.createElement('div');

      vigente.append(
        crearElemento('dt', '', 'Presupuesto vigente'),
        crearElemento('dd', '', moneda(finalidad.vigente))
      );
      ejecutado.append(
        crearElemento('dt', '', 'Presupuesto ejecutado'),
        crearElemento('dd', '', moneda(finalidad.ejecutado))
      );
      detalle.append(vigente, ejecutado);
      cabecera.append(titulo, ejecucion);
      tarjeta.append(cabecera, detalle);
      fragmento.append(tarjeta);
    });

    elementos.finalidades.replaceChildren(fragmento);
  }

  function renderizarPersonas(personas) {
    const fragmento = document.createDocumentFragment();

    Object.entries(personas || {}).forEach(([renglon, cantidad]) => {
      const item = crearElemento('div', 'tablero-persona');
      item.append(
        crearElemento('span', '', `Renglón ${renglon}`),
        crearElemento('strong', '', numero(cantidad))
      );
      fragmento.append(item);
    });

    elementos.personas.replaceChildren(fragmento);
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
      const tarjeta = crearElemento('article', 'tablero-avance');
      tarjeta.append(
        crearElemento('span', 'tablero-avance-codigo', avance.codigo || '—'),
        crearElemento('p', '', avance.texto || 'Sin descripción disponible.')
      );
      fragmento.append(tarjeta);
    });

    elementos.avances.replaceChildren(fragmento);
  }

  function renderizarDashboard(datos) {
    const { periodo, presupuesto, serviciosPersonales, fuente = {} } = datos;
    const progresoGeneral = limitarPorcentaje(presupuesto.porcentajeEjecucion);
    const progresoPersonal = limitarPorcentaje(serviciosPersonales.porcentajeEjecucion);

    elementos.fechaCorte.textContent = fechaLegible(periodo.fechaCorte);
    elementos.periodoVisible.textContent = periodo.etiqueta || periodo.id;
    elementos.presupuestoVigente.textContent = moneda(presupuesto.vigente);
    elementos.presupuestoEjecutado.textContent = moneda(presupuesto.ejecutado);
    elementos.presupuestoSaldo.textContent = moneda(presupuesto.saldo);
    elementos.presupuestoPorcentaje.textContent = porcentaje(presupuesto.porcentajeEjecucion);
    elementos.anilloPorcentaje.textContent = porcentaje(presupuesto.porcentajeEjecucion);
    elementos.graficaEjecucion.style.setProperty('--progreso', progresoGeneral);
    elementos.graficaEjecucion.setAttribute(
      'aria-label',
      `Ejecución presupuestaria de ${porcentaje(presupuesto.porcentajeEjecucion)}`
    );
    elementos.balanceEjecutado.textContent = moneda(presupuesto.ejecutado);
    elementos.balanceDisponible.textContent = moneda(presupuesto.saldo);

    renderizarGrupos(datos.gruposGasto, presupuesto.ejecutado);
    renderizarFinalidades(datos.finalidades);

    elementos.personalPresupuesto.textContent = moneda(serviciosPersonales.presupuesto);
    elementos.personalEjecutado.textContent = moneda(serviciosPersonales.ejecutado);
    elementos.personalPorcentaje.textContent = porcentaje(serviciosPersonales.porcentajeEjecucion);
    elementos.personalBarra.style.setProperty('--ancho', `${progresoPersonal}%`);
    renderizarPersonas(serviciosPersonales.personas);
    renderizarProgramas(datos.programas);
    renderizarAvances(datos.avances);

    elementos.fuenteTipo.textContent = fuente.tipo || 'Fuente no indicada';
    elementos.fuenteArchivo.textContent = fuente.archivo || 'Sin archivo indicado';
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
        'No fue posible cargar la información de este período. Verifica que el archivo JSON exista y tenga el formato correcto.',
        'error'
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

  async function iniciarDashboard() {
    if (!elementos.selectorAnio
      || !elementos.selectorMes
      || !elementos.estado
      || !elementos.contenido) return;

    try {
      const indice = await obtenerJson('periodos.json');
      if (!validarIndice(indice)) {
        throw new Error('periodos.json no contiene períodos válidos.');
      }

      const periodoInicial = prepararSelectores(indice);
      await cargarPeriodo(periodoInicial);
    } catch (error) {
      console.error('Error iniciando el tablero:', error);
      elementos.selectorAnio.disabled = true;
      elementos.selectorMes.disabled = true;
      elementos.contenido.hidden = true;
      mostrarEstado(
        'No fue posible consultar los períodos disponibles. Verifica el archivo periodos.json y ejecuta el sitio mediante un servidor HTTP.',
        'error'
      );
    }
  }

  iniciarDashboard();
}());
