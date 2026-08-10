/* =====================================================
   TRAMITES.JS
   Datos y lógica de la página de trámites:
   - Array `tramites` con la información de cada uno
   - Renderiza el listado izquierdo
   - Al hacer clic, muestra instrucciones/requisitos a la
     derecha y habilita el botón de descarga del PDF
===================================================== */

const tramites = [
  {
    id: 1,
    nombre: "Anexion de comunidades",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Decreto 12-2002 Código Municipal Artículos del 26 al 32, Constitución Política de la Republica de Guatemala",
      "Descargue e imprima el formulario.",
      "llenar el formulario con los datos solicitados.",
      "Preséntelo en Secretaría de la Gobernación Departamental en horario de oficina.",
      "envia el fomrulario al coorreo (uni.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI del solicitante.",
      "Declaración jurada de los vecinos de la comunidad.",
      "Croquis o dirección exacta del lugar."
    ]
  },
  {
    id: 2,
    nombre: "Autorización de colecta pública",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Fundamento Legal: Decreto Número 2082 del 02.05.1938, Artículos 5, 6, 8, 12 y 19; Acuerdo Presidencial del 09.09.1958; Ley de los Consejos de Desarrollo Urbano y Rural, Artículo 12;  Código Municipal, Artículos 18, 19 y 20; y  Artículo 264, numeral 19  del Código Penal.",
      "Descarga el formulario.",
      "Llene el formulario con los datos solicitados.",
      "Preséntelo en Secretaría de la Gobernación Departamental en horario de oficina.",
      "envia el fomrulario al coorreo (uni.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Solicitud dirigida al Gobernador Departamental en la cual requieren la autorización para que su Comité pueda recaudar fondos Públicos",
      "Fotocopia de Certificación del Acta extendida por la Municipalidad correspondiente en la cual les autorizaron el Comité.",
      "Fotocopia de DPI de los integrantes del Comité.",
      "Fotocopia de Acta de la comunidad.",
      "Presupuesto financiero del proyecto a ejecutar."
    ]
  },
   {
    id: 3,
    nombre: "Autorización de licencias varias",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "Reúna las firmas de aval de los organizadores de la rifa.",
      "Preséntelo en Secretaría junto con los requisitos solicitados."
    ],
    requisitos: [
      "Fotocopia de DPI o pasaporte del solicitante y del Representante legal (en su caso).",
      "Representación Legal.",
      "Dictamen favorable del Consejo Municipal correspondiente.",
      "Comprobante de pago del arbitrio municipal.",
      "Autorización para el uso de las instalaciones (si el presentado no fuere el propietario).",
      "Constancia de la inscripción en el Registro Tributario Unificado.",
      "Nombre de los jueces y fotocopia de DPI de dichos jueces; uno que verá y el otro que sentenciará quien ganó (Artículo 7º. Reglamento para Lides de Gallos).",
      "Dirección exacta de la casa donde se pondrá el negocio (en el caso de baratillos).",
      "Referencias personales que garanticen la honradez de la conducta del solicitante (en el caso de baratillos)."
    ]
  },
   {
    id: 4,
    nombre: "Autoriazación de promociones comerciales",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "se autoriza a diferentes entidades la impresión de cupones, vales, tiquetes y otros documentos para la realización de sorteos",
      "Descargue e imprima el formulario.",
      "llenar el formulario",
      "Preséntelo en Secretaría junto con los requisitos solicitados."
    ],
    requisitos: [
      "Fotocopia de DPI o pasaporte del solicitante o Representante Legal.",
      "Fotocopia de la Patente de Comercio de Empresa (si es comerciante individual patente de comercio persona individual y de sociedad si es persona colectiva).",
      "Fotocopia de la Patente de Comercio de Empresa (si es comerciante individual).",
      "Fotocopia de Patente de Comercio de Empresa y de Sociedades (si es persona colectiva).",
      "Comprobante de pago de la Municipalidad por el 10% de la emisión de los Bingos, Rifas y Sorteos.",
      "Se debe adjuntar el presupuesto que contenga las características de cada uno de los premios, precio unitario y el monto global de premios en total."
    ]
  },
   {
    id: 5,
    nombre: "Autorización para licencias de rifas y sorteos",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "llene el formulario con los datos solicitados.",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI o pasaporte del solicitante o Representante Legal.",
      "Fotocopia de la Patente de Comercio de Empresa (si es comerciante individual patente de comercio persona individual y de sociedad si es persona colectiva)",
      "Fotocopia de la Patente de Comercio de Empresa ( si es comerciante individual).",
      "Fotocopia de Patente de Comercio de Empresa y de Sociedades (si es persona colectiva).",
      "Comprobante de pago de la Municipalidad por el 10% de la emisión de los Bingos, Rifas y Sorteos."
    ]
  },
   {
    id: 6,
    nombre: "Creación y modificación de municipios",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "llene el formulario",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI del responsable.",
      "Firmas de aval de los organizadores.",
      "Declaración jurada"
    ]
  },
   {
    id: 7,
    nombre: "Denuncia de conflictividad en el departamento",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "llene el formulario ",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI o pasaporte",
      "Nombramiento de la calidad en que actúo.",
      "Material audiovisual (videos, fotografías)",
    ]
  },
   {
    id: 8,
    nombre: "Petición de expropiación",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "llene el formulario",
      "Preséntelo en Secretaría junto con los requisitos solicitados."
    ],
    requisitos: [
      "Designación del bien cuya expropiación se persigue, con todos los datos que pueda identificarlo.",
      "Certificación de la oficina respectiva en que conste el valor de la declaración fiscal.",
      "Indicación de la disposición legal en virtud de la cual se declara de utilidad o necesidad públicas o interés social, el bien.",
      "Expresión de la suma que ofrece el expropiante, en concepto de indemnización total, debiendo fundamentar sus conclusiones.",
      "Informe técnico de que el bien expropiado es el que se necesita para ejecutar la obra. (en caso se tratara de inmuebles)."
    ]
  },
   {
    id: 9,
    nombre: "Recepción de notificaciones de reuniónes y manifestaciones.",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI o pasaporte.",
      "Visto Bueno del Párroco o Pastor",
      "Plan de actividades (croquis).",
      "Autorización Municipal Notificación al Ministerio de Salud y Asistencia Social Notificación a la Policía Nacional Civil"
    ]
  },
   {
    id: 10,
    nombre: "Solicitud de acceso a la información pública",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Articulo 38 al 45 del decreto 57-2008 Ley de Acceso a la Información Publica",
      "Descargue e imprima el formulario.",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI",
      "autenticación de las solicitudes "
    ]
  },
   {
    id: 11,
    nombre: "Solicitud de carnet de la tercera edad",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Fundamento Legal: Ley de Protección para las personas de la tercera edad Decreto No. 80-96 Articulo 7",
      "Descargue e imprima el formulario.",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI",
      "Tipo de Sangre",
      "Responsable del Adulto Mayor",
      "Numero de teléfono por emergencia",
      "Padecimientos",
      "Dirección exacta"
    ]
  },
   {
    id: 12,
    nombre: "Solicitud de copias simples informes o certificaciones de expedientes administrativos",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "llene el formulario",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI.",
      "Nombre del expediente o informe que solicita",
      "Fechas"
    ]
  },
   {
    id: 13,
    nombre: "Sustanciación de naturalizacion concesiva",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "llene el formulario",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Certificado de inscripción de residente, extendida por la Dirección General de Migración",
      "Certificación de Extranjero Domiciliado, extendido por el Registro de las Personas RENAP",
      "Certificación de Movimiento Migratorio",
      "Certificación de Carencia de Antecedentes Penales, extendida por el Organismo Judicial",
      " Certificación de Carencia de Antecedentes Policíacos, extendida por la Dirección General de la Policía Nacional Civil",
      "Carta de Nacionalidad, debidamente autenticada por el Ministerio de Relaciones Exteriores de Guatemala; • Inscripción de Constancia de Ingresos, consistente en:________________________ _________________________________ (Inscripción de ingreso mensual, patente de comercio de empresa, constancia de inscripción y modificación al registro tributario unificado, declaración y recibo de pago mensual del Impuesto al Valor Agregado y declaración jurada y recibo de pago mensual del Impuesto Sobre la Renta); • Recibo de pago de la cuota de extranjería correspondiente al año______________ y recibo del pago del boleto de ornato del año__________________; ",
      " Pasaporte original",
      " Fotocopia de DPI debidamente autenticada.",
    ]
  },
    {
    id: 14,
    nombre: "Autorización de licencias (Animales Peligrosos)",
    pdf: "/assets/pdf/01TableroRendicionDeCuentas.pdf",
    instrucciones: [
      "Descargue e imprima el formulario.",
      "llene el formulario",
      "Preséntelo en Secretaría junto con los requisitos solicitados.",
      "enviar el formulario al correo (udi.gobernacionbajaverapaz.gob.gt)"
    ],
    requisitos: [
      "Fotocopia de DPI."
    ]
  }
];

function renderListaTramites() {
  const lista = document.getElementById('listaTramites');
  if (!lista) return;

  lista.innerHTML = tramites.map(t => `
    <li>
      <button class="item-tramite" data-id="${t.id}">
        <span class="numero">${t.id}</span>
        <span>${t.nombre}</span>
      </button>
    </li>
  `).join('');

  lista.querySelectorAll('.item-tramite').forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.dataset.id, 10);
      mostrarTramite(id);
    });
  });
}

function mostrarTramite(id) {
  const tramite = tramites.find(t => t.id === id);
  const detalle = document.getElementById('detalleTramite');
  if (!tramite || !detalle) return;

  // Marcar el botón activo en el listado
  document.querySelectorAll('.item-tramite').forEach(b => {
    b.classList.toggle('activo', parseInt(b.dataset.id, 10) === id);
  });

  detalle.innerHTML = `
    <span class="ojo">Trámite ${tramite.id}</span>
    <h2>${tramite.nombre}</h2>

    <h4>Instrucciones</h4>
    <ol>
      ${tramite.instrucciones.map(paso => `<li>${paso}</li>`).join('')}
    </ol>

    <h4>Requisitos</h4>
    <ul class="lista-requisitos">
      ${tramite.requisitos.map(req => `<li>${req}</li>`).join('')}
    </ul>

    <a href="${tramite.pdf}" class="btn-descarga" download>
      ⬇ Descargar formulario (PDF)
    </a>
  `;

  // Permite compartir/recargar en el mismo trámite
  history.replaceState(null, '', `#tramite-${id}`);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('listaTramites')) return; // solo corre en tramites.html

  renderListaTramites();

  // Si la URL trae un hash (#tramite-3), abre ese trámite directamente
  const hash = location.hash.match(/tramite-(\d+)/);
  const idInicial = hash ? parseInt(hash[1], 10) : tramites[0].id;
  mostrarTramite(idInicial);
});