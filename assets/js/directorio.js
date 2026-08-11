

const instituciones = [
  {
    nombre: "Secretaría de Planificación y Programación de la Presidencia (SEGEPLAN)",
    categoria: "Ministerios",
    ubicacion: "Salamá ",
    Telefono: "7940-0165",
    direccion: "2a calle5-35 zona 1 (atras del edificio de gobernación departamental)",
    web: "https://portal.segeplan.gob.gt/segeplan",
    color: "#0f2c66",
    imagen: "https://portal.segeplan.gob.gt/segeplan/wp-content/uploads/2022/09/Logo-Final-2019-01-scaled.jpg" 
  },
  {
    nombre: "Ministerio de Desarrollo Social (MIDES)",
    categoria: "Ministerios",
    ubicacion: "Salamá",
    Telefono: "2300-5400",
    direccion: "",
    web: "https://www.mides.gob.gt/",
    color: "#2f5fd6",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logotipo-MIDES-2024-2028_AZUL_H.png"
  },
  {
    nombre: "Ministerio de Agricultura, Ganadería y Alimentación (MAGA)",
    categoria: "Ministerios",
    ubicacion: "San Jerónimo, Baja Verapaz",
    Telefono: "2413-7315",
    direccion: "Barrio Abajo, Calle 0-04, San Jerónimo, Baja Verapaz",
    web: "https://www.maga.gob.gt/",
    color: "#2f5fd6",
    imagen: "https://www.maga.gob.gt/wp-content/uploads/2024/03/Magaweb2.jpg"
  },
  {
    nombre: "Dirección Departamental de Redes Integradas de Servicios de Salud de Baja Verapaz (DDRISS BV)",
    categoria: "Ministerios",
    ubicacion: "Salamá, Baja Verapaz",
    Telefono: "7729-0800",
    direccion: "",
    web: "",
    color: "#2f5fd6",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLe7JTm2PTVc_-XA1riZZ75uy1CR-BNpWiLNWFVDtY759iaU_e92Lx5QwG&s=10"
  },
   {
    nombre: "Dirección Departamental de Redes Integradas de Servicios de Salud de Baja Verapaz (DDRISS BV)",
    categoria: "Ministerios",
    ubicacion: "Salamá, Baja Verapaz",
    Telefono: "7940-0043",
    direccion: "11ª Avenida 1-99, Zona 6, Salamá, Baja Verapaz",
    web: "https://edu.mineduc.gob.gt/BajaVerapaz/",
    color: "#2f5fd6",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7aZAoO6SZsTOO6-0jHOfvl9yKbJdkRkTSY2wZ4wLuBQ8qD8ftKArUVdQ&s=10"
  },
     {
    nombre: "Zona vial 14 (MICIVI)",
    categoria: "Ministerios",
    ubicacion: "Salamá, Baja Verapaz",
    Telefono: "7940-0514",
    direccion: " 1ª Calle 12-52, Zona 2, Salamá, Baja Verapaz.",
    web: "https://www.facebook.com/caminosgt",
    color: "#2f5fd6",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgE-eLT9dywIQD30QZ0ZFNP1A7p236S3PYOCddZqCQBIgv19eWuzhkZv4&s=10"
  },
 

];

const CONECTORES = ["de", "del", "la", "los", "las", "y", "en"];

function iniciales(nombre) {
  const palabras = nombre
    .split(" ")
    .filter(p => p.length > 1 && !CONECTORES.includes(p.toLowerCase()));

  const letras = palabras.slice(0, 2).map(p => p[0]).join("").toUpperCase();
  return letras || nombre.slice(0, 2).toUpperCase();
}

function tarjetaInstitucionHTML(inst) {
  const cabecera = inst.imagen
    ? `<div class="miniatura-institucion" style="background-image:url('${inst.imagen}')"></div>`
    : `<div class="miniatura-institucion sin-imagen" style="background:${inst.color}">
         <span>${iniciales(inst.nombre)}</span>
       </div>`;

  return `
    <article class="tarjeta-institucion">
      ${cabecera}
      <div class="contenido-institucion">
        <h3>${inst.nombre}</h3>
        ${inst.subtitulo ? `<p class="subtitulo-institucion">${inst.subtitulo}</p>` : ""}

        <div class="dato-institucion">
          <span class="etiqueta-dato">Ubicación:</span>
          <span>${inst.ubicacion}</span>
        </div>
        <div class="dato-institucion">
          <span class="etiqueta-dato">Dirección:</span>
          <span>${inst.direccion}</span>
        </div>
        <div class="dato-institucion">
          <span class="etiqueta-dato">Teléfono:</span>
          <span>${inst.Telefono}</span>
        </div>
        <div class="dato-institucion">
          <span class="etiqueta-dato">Web:</span>
          <a href="${inst.web}" target="_blank" rel="noopener">Página Oficial</a>
        </div>

        <span class="categoria-institucion">${inst.categoria}</span>
      </div>
    </article>
  `;
}

function renderDirectorio() {
  const pista = document.getElementById("pistaCarrusel");
  if (!pista) return;

  if (!instituciones.length) {
    pista.innerHTML = `<p style="padding:20px;color:var(--texto-gris);">Aún no hay instituciones cargadas.</p>`;
    return;
  }

  const tarjetas = instituciones.map(tarjetaInstitucionHTML).join("");

  pista.innerHTML = tarjetas + tarjetas;
}

document.addEventListener("DOMContentLoaded", () => {
  renderDirectorio();
  const pista = document.getElementById("pistaCarrusel");
  if (!pista) return;

  let temporizador;
  pista.addEventListener("touchstart", () => {
    pista.classList.add("pausado");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => pista.classList.remove("pausado"), 4000);
  });
});