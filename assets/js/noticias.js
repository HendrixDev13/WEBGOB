const noticiasContenedor = document.getElementById('noticiasLista');
const noticiasError = document.getElementById('noticiasError');

const LOCAL_NOTICIAS_URL = '/assets/data/noticias.json';

function crearTarjetaNoticia(noticia) {
  const tieneImagen = noticia.image ? true : false;
  const imagen = tieneImagen ? `
      <div class="noticia-thumb">
        <img src="${noticia.image}" alt="${noticia.title}">
      </div>
  ` : '';

  return `
    <article class="noticia-card">
      <div class="noticia-texto">
        <span class="fecha-noticia">${noticia.date}</span>
        <h2>${noticia.title}</h2>
        <p>${noticia.description || noticia.summary || ''}</p>
        <a href="${noticia.url}" class="leer-mas" target="_blank" rel="noopener">Leer más</a>
      </div>
      ${imagen}
    </article>
  `;
}

function mostrarError(mensaje) {
  if (!noticiasError) return;
  noticiasError.textContent = mensaje;
  noticiasError.style.display = 'block';
}

async function fetchNoticias() {
  try {
    const respuesta = await fetch(LOCAL_NOTICIAS_URL);
    if (!respuesta.ok) throw new Error('No se pudo cargar el archivo de noticias.');
    const datos = await respuesta.json();
    return datos.items || [];
  } catch (error) {
    console.error('Error cargando noticias:', error);
    mostrarError('No se pudo cargar las noticias en este momento. Verifique la conexión o use un proxy para AGN.');
    return [];
  }
}

async function renderNoticias() {
  if (!noticiasContenedor) return;

  const noticias = await fetchNoticias();

  if (!noticias.length) {
    noticiasContenedor.innerHTML = '<p style="grid-column:1/-1;color:var(--texto-gris);text-align:center;">No hay noticias disponibles en este momento.</p>';
    return;
  }

  noticiasContenedor.innerHTML = noticias.map(crearTarjetaNoticia).join('');
}

// Si AGN ofrece un RSS o JSON accesible, sustituye fetchNoticias() por una función que
// lea ese recurso (usando un proxy si hace falta para evitar problemas de CORS).

renderNoticias();
