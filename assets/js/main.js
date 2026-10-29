 
  /* // IMPORTANTE: fetch() de archivos locales requiere que el
   sitio se sirva vía HTTP (Live Server, `python -m http.server`,
   Netlify, GitHub Pages, cPanel, etc.). No funciona abriendo
   el HTML directo con doble clic (protocolo file://).
=====================================================  */
 
async function cargarComponente(selector, ruta) {
  const contenedor = document.querySelector(selector);
  if (!contenedor) return;
 
  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta}`);
    contenedor.innerHTML = await respuesta.text();
  } catch (error) {
    console.error('Error cargando componente:', error);
    contenedor.innerHTML = `<p style="text-align:center;padding:12px;color:#900;">
      No se pudo cargar este componente (${ruta}).
    </p>`;
  }
}
 
function activarMenuMovil() {
  const btnMenu = document.querySelector('.btn-menu-movil');
  const menu = document.querySelector('.menu-principal');
  if (!btnMenu || !menu) return;
 
  btnMenu.addEventListener('click', () => {
    const abierto = menu.classList.toggle('open');
    if (abierto) {
      menu.style.display = 'flex';
    } else {
      menu.style.display = '';
      cerrarSubmenus();
    }
  });
}

function cerrarSubmenus() {
  document.querySelectorAll('.menu-item.open').forEach(item => item.classList.remove('open'));
}

function activarSubmenusMovil() {
  const menu = document.querySelector('.menu-principal');
  if (!menu) return;
 
  menu.querySelectorAll('.menu-item > a').forEach(link => {
    const submenu = link.nextElementSibling;
    if (submenu && submenu.classList.contains('submenu')) {
      link.addEventListener('click', event => {
        if (window.innerWidth <= 960) {
          event.preventDefault();
          const item = link.closest('.menu-item');
          const abierto = item.classList.toggle('open');
          if (!abierto) {
            item.querySelectorAll('.menu-item.open').forEach(child => child.classList.remove('open'));
          }
        }
      });
    }
  });
}
 
function marcarLinkActivo() {
  const paginaActual = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-principal a[data-pagina]').forEach(link => {
    if (link.dataset.pagina === paginaActual) {
      link.classList.add('activo');
    }
  });
}
 
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Cargar navbar y footer en paralelo
  await Promise.all([
    cargarComponente('#navbar-container', '/components/navbar.html'),
    cargarComponente('#footer-container', '/components/footer.html')
  ]);
 
  // 2) Una vez inyectado el navbar, activar su comportamiento
  activarMenuMovil();
  activarSubmenusMovil();
  marcarLinkActivo();
});


//boton
// ===================== BOTÓN FLOTANTE: BUSCA TU SOLICITUD =====================


(function () {
  const contenedor = document.querySelector('.botones-flotantes');

  if (!contenedor) return;

  const botones = contenedor.querySelectorAll('.btn-solicitud');

  if (!botones.length) return;

  const TIEMPO_INICIAL = 4000;
  const UMBRAL_SCROLL = 80;
  const esMovil = window.matchMedia('(max-width: 850px)');

  let temporizadorInicial;
  let compactados = true;

  function compactarBotones() {
    if (compactados) return;

    compactados = true;

    botones.forEach(function (boton) {
      boton.classList.add('compacto');
    });
  }

  function mostrarBotonesCompletos() {
    compactados = false;

    botones.forEach(function (boton) {
      boton.classList.remove('compacto');
    });
  }

  // Mostrar los textos al cargar y compactar después de 4 segundos.
  if (window.scrollY < UMBRAL_SCROLL) {
    mostrarBotonesCompletos();

    temporizadorInicial = window.setTimeout(function () {
      compactarBotones();
    }, TIEMPO_INICIAL);
  } else {
    compactarBotones();
  }

  // Si la persona empieza a navegar, compactar inmediatamente.
  window.addEventListener('scroll', function () {
    if (window.scrollY >= UMBRAL_SCROLL) {
      window.clearTimeout(temporizadorInicial);
      compactarBotones();
    }
  }, { passive: true });

  // En pantallas pequeñas, el toque permite expandir temporalmente
  // un botón sin navegar inmediatamente.
  botones.forEach(function (boton) {
    boton.addEventListener('click', function (evento) {
      if (!esMovil.matches || !boton.classList.contains('compacto')) {
        return;
      }

      // Primer toque: mostrar texto. Segundo toque: abrir el enlace.
      evento.preventDefault();

      const yaExpandido = boton.dataset.expandido === 'true';

      botones.forEach(function (otro) {
        otro.classList.add('compacto');
        otro.dataset.expandido = 'false';
      });

      if (!yaExpandido) {
        boton.classList.remove('compacto');
        boton.dataset.expandido = 'true';

        window.clearTimeout(temporizadorInicial);

        temporizadorInicial = window.setTimeout(function () {
          compactarBotones();

          botones.forEach(function (otro) {
            otro.dataset.expandido = 'false';
          });
        }, 3000);
      } else {
        boton.dataset.expandido = 'false';
        window.location.href = boton.href;
      }
    });
  });

  // Al volver a una pantalla grande, restablecer el comportamiento.
  esMovil.addEventListener('change', function () {
    window.clearTimeout(temporizadorInicial);

    if (esMovil.matches) {
      compactarBotones();
    } else if (window.scrollY < UMBRAL_SCROLL) {
      mostrarBotonesCompletos();

      temporizadorInicial = window.setTimeout(
        compactarBotones,
        TIEMPO_INICIAL
      );
    } else {
      compactarBotones();
    }
  });
})();
