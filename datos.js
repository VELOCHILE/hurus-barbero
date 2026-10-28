/* Datos de Hurus Barber Studio — web oficial.
   Fuente: formulario del cliente (15-10-2026) + ficha de Google + Instagram @hurus_barber.
   Se versiona: datos.js?v=N */
/* v22: FAQ actualizado, videos vaciados, fila virtual eliminada */
window.HURUS = {
  version: 2,
  marca: {
    nombre: 'Hurus Studio',
    nombreLargo: 'Hurus Barber Studio',
    ciudad: 'Rancagua',
    lema: 'Estilo · Precisión · Confianza',
    instagram: '@hurus_barber',
    instagramUrl: 'https://www.instagram.com/hurus_barber/',
    telefono: '+56 9 4960 7680',
    telefonoTel: '+56949607680',
    whatsapp: '56949607680',
    googleUrl: 'https://www.google.com/maps/search/?api=1&query=Barber%C3%ADa%20Hurus%20studio%20Membrillar%2050%20Rancagua'
  },
  locales: [
    {
      id: 'membrillar',
      nombre: 'Membrillar',
      direccion: 'Membrillar 50, Local 1',
      comuna: 'Rancagua',
      horario: 'Lunes 11:00 a 19:00 · Martes a sábado 10:00 a 19:00',
      horarioNota: 'Domingo cerrado',
      mapa: 'https://www.google.com/maps?q=-34.1713479,-70.7340369&z=16&output=embed',
      comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=-34.1713479,-70.7340369',
      sillas: 3,
      foto: 'img/sillones-barberia-hurus-rancagua.webp',
      fotoAlt: 'Tres sillones negros con cromo bajo los aros de luz'
    },
    {
      id: 'colon',
      nombre: 'Cristóbal Colón',
      direccion: 'Cristóbal Colón 408',
      comuna: 'Rancagua',
      horario: 'Lunes 11:00 a 19:00 · Martes a sábado 10:00 a 19:00',
      horarioNota: 'Domingo cerrado',
      mapa: 'https://www.google.com/maps?q=Crist%C3%B3bal%20Col%C3%B3n%20408%2C%20Rancagua&z=16&output=embed',
      comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=Crist%C3%B3bal%20Col%C3%B3n%20408%2C%20Rancagua',
      sillas: 2,
      foto: 'img/recepcion-hurus-cristobal-colon.webp',
      fotoAlt: 'Recepción negra acanalada con lámpara de bronce'
    }
  ],
  horario: { dias: [1, 2, 3, 4, 5, 6], abre: '10:00', cierra: '19:00', ultimaHora: '18:30', paso: 30, lunesAbre: '11:00' },
  servicios: [
    { id: 'clasico', nombre: 'Corte clásico', precio: 18000, efectivo: 15000, min: 45 },
    { id: 'corte-barba', nombre: 'Corte + barba', precio: 24000, efectivo: 21000, min: 60 },
    { id: 'corte-barba-toalla', nombre: 'Corte + barba con toalla', precio: 27000, efectivo: 24000, min: 60 },
    { id: 'tijeras', nombre: 'Corte solo tijeras', precio: 21000, efectivo: 18000, min: 45 },
    { id: 'barba', nombre: 'Solo barba', precio: 16000, efectivo: 13000, min: 30 }
  ],
  tarifa: [
    { nombre: 'Corte clásico', precio: 18000, efectivo: 15000, dur: '30-45 min' },
    { nombre: 'Corte + barba', precio: 24000, efectivo: 21000, dur: '45-60 min' },
    { nombre: 'Corte + barba con toalla', precio: 27000, efectivo: 24000, dur: '60 min' },
    { nombre: 'Corte solo tijeras', precio: 21000, efectivo: 18000, dur: '45 min' },
    { nombre: 'Solo barba', precio: 16000, efectivo: 13000, dur: '30 min' }
  ],
  descuentoEfectivo: 'Pagando en efectivo todos los servicios tienen precio rebajado.',
  descuentoNota: '',
  barberos: [
    { id: 'pedro', nombre: 'Pedro', foto: 'img/barberos/pedro-of.webp', menciones: 8, locales: ['membrillar'], cita: { t: 'Me corte con el Pedro, tiene muy buena mano, me dejó muy bien el corte, buen servicio', n: 'Federico', f: '2026-03-24' } },
    { id: 'ignacio', nombre: 'Ignacio', foto: 'img/barberos/ignacio-of.webp', menciones: 1, locales: ['membrillar'], cita: { t: 'en especial Nacho con mi hijo fue muy paciente', n: 'Maite Baker', f: '2025-10-28' } },
    { id: 'gonzalo', nombre: 'Gonzalo', foto: 'img/barberos/gonzalo-of.webp', menciones: 0, locales: ['membrillar'] },
    { id: 'joaquin-estay', nombre: 'Joaquín Estay', foto: 'img/barberos/joaquin-estay-of.webp', menciones: 7, locales: ['membrillar'], cita: { t: 'los barberos super simpáticos y sobretodo mi barbero Joaquin, gracias por siempre ser el mejor', n: 'Mauricio Baez', f: '2025-08-22' } },
    { id: 'joaquin-vargas', nombre: 'Joaquín Vargas', foto: 'img/barberos/joaquin-vargas-of.webp', menciones: 0, locales: ['membrillar'] },
    { id: 'jose', nombre: 'José Allendes', foto: 'img/barberos/jose-of.webp', menciones: 1, locales: ['membrillar'], cita: { t: 'un exelente barbero corta muy bien además de un tiempo exelente que cumple', n: 'Sebastian Gonzalez', f: '2025-12-03' } },
    { id: 'hans', nombre: 'Hans', foto: 'img/barberos/hans-of.webp', menciones: 0, locales: ['membrillar'] },
    { id: 'camilo', nombre: 'Camilo Alonso', foto: 'img/barberos/camilo-alonso-of.webp', menciones: 0, locales: ['membrillar'] },
    { id: 'kevin', nombre: 'Kevin', foto: 'img/barberos/kevin-of.webp', menciones: 0, locales: ['membrillar'] },
    { id: 'juan-camilo', nombre: 'Juan Camilo', foto: 'img/barberos/juan-camilo-of.webp', menciones: 2, locales: ['colon'], cita: { t: 'Súper buen corte, me corte con Juan súper atento 10/10', n: 'Agustin Felipe Ramirez Cartagena', f: '2026-06-22' } },
    { id: 'jeremy', nombre: 'Jeremy', foto: 'img/barberos/jeremy-of.webp', menciones: 5, locales: ['colon'], cita: { t: 'Una calidad excelente, nada que decir, Jeremy Rojas uno de los mejores en Hurus, todo muy bien.', n: 'Martín MV', f: '2026-03-21' } },
    { id: 'dilan', nombre: 'Dilan', foto: 'img/barberos/dilan-of.webp', menciones: 0, locales: ['colon'] },
    { id: 'nicolas', nombre: 'Nicolás', foto: 'img/barberos/nicolas-of.webp', menciones: 10, locales: ['colon'], cita: { t: 'Tiene una tremenda técnica es súper detallista con las líneas y el degradado y se toma el tiempo para que el corte quede perfecto', n: 'Jesus Valenzuela', f: '2026-06-22' } }
  ],
  pasos: [
    { t: 'Elige local y servicio', d: 'Membrillar o Cristóbal Colón. Corte, barba, toalla caliente o tijeras: tú decides.' },
    { t: 'Elige barbero, día y hora', d: 'Con tu barbero favorito o con el primero que se desocupe. Tú eliges.' },
    { t: 'Pagas y listo', d: 'Elige tarjeta, transferencia o efectivo al llegar. Tu hora queda confirmada al instante.' }
  ],
  faq: [
    { p: '¿Puedo llegar sin hora?', r: 'Sí, se atiende por orden de llegada. Pero con hora te sientas al tiro.' },
    { p: '¿Cuál es el horario?', r: 'Lunes de 11:00 a 19:00. Martes a sábado de 10:00 a 19:00. Domingo cerrado.' },
    { p: '¿Cuál es la diferencia entre reserva y sin reserva?', r: 'Con reserva eliges barbero y hora exacta. Sin reserva, llegas al local y te atendemos por orden de llegada.' },
    { p: '¿Qué pasa si llego tarde?', r: 'Si no llegas en 15 minutos, la hora se libera debido a la constante demanda. Si vas a demorar, avisa por WhatsApp y lo vemos.' },
    { p: '¿Puedo elegir barbero?', r: 'Sí. En la reserva eliges al barbero que quieras, o dejas que te atienda el primero que se desocupe.' },
    { p: '¿Efectivo o tarjeta?', r: 'Las dos. Pagando en efectivo ahorras en cada servicio.' }
  ],
  galeria: [
    { src: 'img/sillones-barberia-hurus-rancagua.webp', w: 720, h: 1279, alt: 'Tres sillones negros con cromo bajo los aros de luz' },
    { src: 'img/barbero-degradado-hurus.webp', w: 720, h: 960, alt: 'Barbero afinando el degradado con la capa HURUS' },
    { src: 'img/sillon-cromo-espejo-luz.webp', w: 720, h: 960, alt: 'Sillón capitoné negro y cromo frente al espejo con luz' },
    { src: 'img/letrero-neon-hurus-barber-studio.webp', w: 720, h: 960, alt: 'Letrero de neón HURUS Barber Studio sobre el mostrador' },
    { src: 'img/corte-degradado-terminado.webp', w: 720, h: 1279, alt: 'Corte terminado frente a las letras HURUS' },
    { src: 'img/barbero-maquina-aro-de-luz.webp', w: 720, h: 960, alt: 'Barbero trabajando con la máquina junto al aro de luz' },
    { src: 'img/recepcion-hurus-cristobal-colon.webp', w: 720, h: 960, alt: 'Recepción negra acanalada con lámpara de bronce' },
    { src: 'img/fila-sillones-barbero.webp', w: 720, h: 962, alt: 'Fila de sillones de barbero vistos desde arriba' },
    { src: 'img/barbero-tijera-espejos.webp', w: 720, h: 960, alt: 'Barbero cortando con tijera frente a los espejos iluminados' },
    { src: 'img/salon-hurus-barberos-atendiendo.webp', w: 1024, h: 768, alt: 'El salón completo con los barberos atendiendo' }
  ],
  videos: [],
  demo: {
    etiqueta: 'Demo por VELO · datos ilustrativos',
    velo: 'https://velochile.com'
  }
};
