// ===================== BOTONES FLOTANTES =====================
(function () {
  'use strict';

  var contenedor = document.querySelector('.botones-flotantes');
  if (!contenedor) return;

  var botones = contenedor.querySelectorAll('.btn-solicitud');
  if (!botones.length) return;

  var TIEMPO_INICIAL = 4000;    // tiempo con texto al cargar la página
  var TIEMPO_EXPANDIDO = 3000;  // tiempo con texto tras tocar un botón en móvil
  var UMBRAL_SCROLL = 80;
  var esMovil = window.matchMedia('(max-width: 850px)');
  var temporizador;

  function compactar() {
    botones.forEach(function (b) { b.classList.add('compacto'); });
  }

  function expandirTodos() {
    botones.forEach(function (b) { b.classList.remove('compacto'); });
  }

  function programarCompactado(ms) {
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(compactar, ms);
  }

  function estadoInicial() {
    window.clearTimeout(temporizador);
    if (window.scrollY < UMBRAL_SCROLL) {
      expandirTodos();
      programarCompactado(TIEMPO_INICIAL);
    } else {
      compactar();
    }
  }

  estadoInicial();

  // Al empezar a navegar, se compactan de inmediato
  window.addEventListener('scroll', function () {
    if (window.scrollY >= UMBRAL_SCROLL) {
      window.clearTimeout(temporizador);
      compactar();
    }
  }, { passive: true });

  // Móvil: primer toque muestra el texto, segundo toque abre el enlace
  botones.forEach(function (boton) {
    boton.addEventListener('click', function (evento) {
      if (!esMovil.matches || !boton.classList.contains('compacto')) return;

      evento.preventDefault();
      compactar();
      boton.classList.remove('compacto');
      programarCompactado(TIEMPO_EXPANDIDO);
    });
  });

  esMovil.addEventListener('change', estadoInicial);
})();