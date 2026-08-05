
const modalGobernador = document.getElementById('modalGobernador');

function abrirModalGobernador() {
  modalGobernador.classList.add('abierto');
  document.body.style.overflow = 'hidden'; // evita que la página se desplace detrás del modal
}

function cerrarModalGobernador() {
  modalGobernador.classList.remove('abierto');
  document.body.style.overflow = '';
}

// Cerrar el modal con la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalGobernador.classList.contains('abierto')) {
    cerrarModalGobernador();
  }
});
