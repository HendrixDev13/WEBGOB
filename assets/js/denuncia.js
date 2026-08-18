const formularioDenuncia = document.querySelector('#form-denuncia');
let captchaValido = false;

window.captchaCompletado = function () {
  captchaValido = true;
  const estadoCaptcha = document.querySelector('#estado-captcha');
  const botonEnviar = document.querySelector('#boton-enviar');
  if (estadoCaptcha) {
    estadoCaptcha.textContent = 'Verificación completada.';
    estadoCaptcha.className = 'estado-captcha verificado';
  }
  if (botonEnviar) {
    botonEnviar.disabled = false;
    botonEnviar.querySelector('span').textContent = 'Enviar denuncia';
  }
};

window.captchaExpirado = function () {
  captchaValido = false;
  const estadoCaptcha = document.querySelector('#estado-captcha');
  const botonEnviar = document.querySelector('#boton-enviar');
  if (estadoCaptcha) {
    estadoCaptcha.textContent = 'La verificación expiró. Complétala nuevamente.';
    estadoCaptcha.className = 'estado-captcha error';
  }
  if (botonEnviar) {
    botonEnviar.disabled = true;
    botonEnviar.querySelector('span').textContent = 'Verifica que eres una persona';
  }
};

window.captchaConError = function () {
  captchaValido = false;
  const estadoCaptcha = document.querySelector('#estado-captcha');
  const botonEnviar = document.querySelector('#boton-enviar');
  if (estadoCaptcha) {
    estadoCaptcha.textContent = 'No fue posible cargar la verificación. Recarga la página e inténtalo nuevamente.';
    estadoCaptcha.className = 'estado-captcha error';
  }
  if (botonEnviar) botonEnviar.disabled = true;
};

if (formularioDenuncia) {
  const radiosTipo = formularioDenuncia.querySelectorAll('input[name="tipo_denuncia"]');
  const seccionPersonales = document.querySelector('#seccion-datos-personales');
  const camposPersonales = seccionPersonales.querySelectorAll('input, select, textarea');
  const descripcion = document.querySelector('#descripcion');
  const contador = document.querySelector('#contador-descripcion');
  const estado = document.querySelector('#estado-formulario');
  const boton = document.querySelector('#boton-enviar');
  const iframe = document.querySelector('#respuesta-apps-script');
  const resultado = document.querySelector('#resultado-denuncia');
  const resultadoCargando = resultado.querySelector('[data-resultado-cargando]');
  const resultadoFinal = resultado.querySelector('[data-resultado-final]');
  const resultadoEtiqueta = resultado.querySelector('[data-resultado-etiqueta]');
  const resultadoTitulo = resultado.querySelector('[data-resultado-titulo]');
  const resultadoMensaje = resultado.querySelector('[data-resultado-mensaje]');
  const resultadoFolioWrap = resultado.querySelector('[data-resultado-folio-wrap]');
  const resultadoFolio = resultado.querySelector('[data-resultado-folio]');
  const botonNuevaDenuncia = document.querySelector('#boton-nueva-denuncia');
  let envioIniciado = false;
  let temporizadorRespuesta = null;

  const cancelarTemporizadorRespuesta = () => {
    if (temporizadorRespuesta) {
      window.clearTimeout(temporizadorRespuesta);
      temporizadorRespuesta = null;
    }
  };

  const ocultarEstado = () => { estado.hidden = true; estado.textContent = ''; estado.className = 'estado-formulario'; };
  const mostrarEstado = (mensaje, tipo = 'error') => {
    estado.textContent = mensaje;
    estado.className = `estado-formulario ${tipo}`;
    estado.hidden = false;
    estado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  function actualizarTipo() {
    const esAnonima = formularioDenuncia.querySelector('input[name="tipo_denuncia"]:checked').value === 'anonima';
    seccionPersonales.hidden = esAnonima;
    seccionPersonales.setAttribute('aria-hidden', String(esAnonima));
    camposPersonales.forEach(campo => {
      campo.disabled = esAnonima;
      campo.required = !esAnonima;
      campo.classList.remove('tocado');
      if (esAnonima) campo.value = '';
    });
    document.querySelector('[data-numero-contexto]').textContent = esAnonima ? '2' : '3';
    document.querySelector('[data-numero-hechos]').textContent = esAnonima ? '3' : '4';
    document.querySelector('[data-numero-confirmacion]').textContent = esAnonima ? '4' : '5';
    ocultarEstado();
  }

  function soloDigitos(campo) {
    campo.addEventListener('input', () => { campo.value = campo.value.replace(/\D/g, '').slice(0, campo.maxLength); });
  }

  function mostrarEnvioEnCurso() {
    resultado.hidden = false;
    resultado.classList.remove('error');
    resultadoCargando.hidden = false;
    resultadoFinal.hidden = true;
  }

  function mostrarResultado(datos) {
    cancelarTemporizadorRespuesta();
    const fueExitoso = datos.exito === true;
    envioIniciado = false;
    resultadoCargando.hidden = true;
    resultadoFinal.hidden = false;
    resultado.classList.toggle('error', !fueExitoso);
    resultadoEtiqueta.textContent = fueExitoso ? 'Registro completado' : 'No se completó el registro';
    resultadoTitulo.textContent = datos.titulo || (fueExitoso ? 'Denuncia registrada' : 'No fue posible registrar la denuncia');
    resultadoMensaje.textContent = datos.mensaje || '';
    resultadoFolio.textContent = datos.folio || '';
    resultadoFolioWrap.hidden = !fueExitoso || !datos.folio;

    if (fueExitoso) {
      boton.disabled = true;
      boton.querySelector('span').textContent = 'Denuncia enviada';
      botonNuevaDenuncia.textContent = 'Nueva denuncia';
    } else {
      if (window.turnstile) window.turnstile.reset();
      window.captchaExpirado();
      botonNuevaDenuncia.textContent = 'Volver al formulario';
    }

    resultado.focus({ preventScroll: true });
    resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function reiniciarFormulario() {
    cancelarTemporizadorRespuesta();
    formularioDenuncia.reset();
    descripcion.value = '';
    contador.textContent = '0';
    formularioDenuncia.querySelectorAll('.tocado').forEach(campo => campo.classList.remove('tocado'));
    ocultarEstado();
    resultado.hidden = true;
    resultado.classList.remove('error');
    resultadoCargando.hidden = false;
    resultadoFinal.hidden = true;
    resultadoFolio.textContent = '';
    iframe.src = 'about:blank';
    envioIniciado = false;
    if (window.turnstile) window.turnstile.reset();
    window.captchaExpirado();
    actualizarTipo();
    formularioDenuncia.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  soloDigitos(document.querySelector('#cui'));
  soloDigitos(document.querySelector('#telefono'));
  radiosTipo.forEach(radio => radio.addEventListener('change', actualizarTipo));
  descripcion.addEventListener('input', () => { contador.textContent = descripcion.value.length; });

  formularioDenuncia.querySelectorAll('input, select, textarea').forEach(campo => {
    campo.addEventListener('blur', () => campo.classList.add('tocado'));
    campo.addEventListener('input', () => { if (campo.checkValidity()) campo.classList.remove('tocado'); ocultarEstado(); });
  });

  formularioDenuncia.addEventListener('submit', event => {
    const endpoint = formularioDenuncia.dataset.appsScriptUrl.trim();
    formularioDenuncia.querySelectorAll(':invalid').forEach(campo => campo.classList.add('tocado'));
    const tokenCaptcha = formularioDenuncia.querySelector('input[name="cf-turnstile-response"]')?.value;
    if (!captchaValido || !tokenCaptcha) {
      event.preventDefault();
      mostrarEstado('Completa la verificación de seguridad antes de enviar la denuncia.');
      return;
    }
    if (!formularioDenuncia.checkValidity()) {
      event.preventDefault();
      formularioDenuncia.reportValidity();
      mostrarEstado('Revisa los campos marcados antes de enviar la denuncia.');
      return;
    }
    if (formularioDenuncia.sitio_web.value) { event.preventDefault(); return; }
    if (!endpoint) {
      event.preventDefault();
      mostrarEstado('El formulario está listo, pero todavía falta configurar la URL de Apps Script.');
      return;
    }
    formularioDenuncia.action = endpoint;
    document.querySelector('#fecha-cliente').value = new Date().toISOString();
    boton.disabled = true;
    boton.querySelector('span').textContent = 'Enviando…';
    mostrarEnvioEnCurso();
    ocultarEstado();
    envioIniciado = true;
    cancelarTemporizadorRespuesta();
    temporizadorRespuesta = window.setTimeout(() => {
      if (!envioIniciado) return;
      envioIniciado = false;
      resultadoCargando.hidden = true;
      resultadoFinal.hidden = false;
      resultado.classList.add('error');
      resultadoEtiqueta.textContent = 'Respuesta no confirmada';
      resultadoTitulo.textContent = 'El servidor tardó demasiado en responder';
      resultadoMensaje.textContent = 'La denuncia podría haberse registrado y el correo podría haberse enviado. Para evitar duplicados, no la envíes nuevamente hasta comprobar el registro en Google Sheets.';
      resultadoFolioWrap.hidden = true;
      boton.querySelector('span').textContent = 'Envío no confirmado';
      botonNuevaDenuncia.textContent = 'Volver al formulario';
      resultado.focus({ preventScroll: true });
      resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60000);
  });

  window.addEventListener('message', event => {
    const origenAppsScript = event.origin === 'https://script.google.com' ||
      /^https:\/\/[^/]*script\.googleusercontent\.com$/.test(event.origin);
    if (!envioIniciado || !origenAppsScript) return;
    if (!event.data || event.data.tipo !== 'resultado-denuncia') return;
    mostrarResultado(event.data);
  });

  botonNuevaDenuncia.addEventListener('click', () => {
    if (resultado.classList.contains('error')) {
      resultado.hidden = true;
      formularioDenuncia.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    reiniciarFormulario();
  });

  actualizarTipo();
}
