 
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