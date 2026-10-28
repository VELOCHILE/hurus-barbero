/* Hurus · Utilidades compartidas entre el sitio y el panel. v4
   Estado en localStorage con prefijo "hurus:". Sin servidor: todo vive en el navegador. */
(function (w) {
  var K = 'hurus:';
  var D = w.HURUS;

  function get(k, def) { try { var v = localStorage.getItem(K + k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } }
  function set(k, v) { try { localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} }
  function del(k) { try { localStorage.removeItem(K + k); } catch (e) {} }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function onCambio(fn) { w.addEventListener('storage', function (e) { if (e.key && e.key.indexOf(K) === 0) fn(e.key.slice(K.length)); }); }

  /* Fechas en hora de Chile */
  var TZ = 'America/Santiago';
  function partesAhora() {
    var o = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    } catch (e) {
      var d = new Date();
      o = { year: d.getFullYear(), month: String(d.getMonth() + 1).padStart(2, '0'), day: String(d.getDate()).padStart(2, '0'), hour: String(d.getHours()).padStart(2, '0'), minute: String(d.getMinutes()).padStart(2, '0') };
    }
    var hh = o.hour === '24' ? '00' : o.hour;
    return { fecha: o.year + '-' + o.month + '-' + o.day, hora: hh + ':' + o.minute };
  }
  function hoy() { return partesAhora().fecha; }
  function horaAhora() { return partesAhora().hora; }
  function fechaDesde(isoF) { var p = isoF.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function sumarDias(isoF, n) { var d = fechaDesde(isoF); d.setDate(d.getDate() + n); return iso(d); }
  function diaSemana(isoF) { return fechaDesde(isoF).getDay(); }
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MESES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function fmtCorta(isoF) { var d = fechaDesde(isoF); return DIAS_C[d.getDay()] + ' ' + d.getDate() + ' ' + MESES_C[d.getMonth()]; }
  function fmtLarga(isoF) { var d = fechaDesde(isoF); return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()]; }
  function clp(n) { return '$' + Number(n).toLocaleString('es-CL'); }
  function minutosDe(h) { var p = h.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function horaDe(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function haceMin(ts) { return Math.max(0, Math.round((Date.now() - ts) / 60000)); }

  function abreHoy(fecha) {
    var ds = diaSemana(fecha || hoy());
    return ds === 1 && D.horario.lunesAbre ? D.horario.lunesAbre : D.horario.abre;
  }

  function estadoApertura() {
    var a = partesAhora(); var ds = diaSemana(a.fecha); var H = D.horario;
    if (H.dias.indexOf(ds) === -1) {
      var sig = ds === 0 ? 'lunes' : 'martes';
      var sigH = ds === 0 && H.lunesAbre ? H.lunesAbre : H.abre;
      return { abierto: false, texto: 'Cerrado hoy · abre ' + sig + ' ' + sigH };
    }
    var abreH = ds === 1 && H.lunesAbre ? H.lunesAbre : H.abre;
    var m = minutosDe(a.hora);
    if (m < minutosDe(abreH)) return { abierto: false, texto: 'Abre hoy a las ' + abreH };
    if (m >= minutosDe(H.cierra)) {
      var sigDia = ds === 6 ? 'lunes' : DIAS[ds + 1];
      var sigAbre = ds === 6 && H.lunesAbre ? H.lunesAbre : ((ds + 1) === 1 && H.lunesAbre ? H.lunesAbre : H.abre);
      return { abierto: false, texto: 'Cerrado · abre ' + sigDia + ' ' + sigAbre };
    }
    return { abierto: true, texto: 'Abierto ahora · hasta las ' + H.cierra };
  }

  /* Catálogo */
  function local(idL) { return D.locales.filter(function (l) { return l.id === idL; })[0] || D.locales[0]; }
  function servicio(idS) { var ov=get('servicios_custom',{})[idS]||{}; var s=D.servicios.filter(function(s){return s.id===idS;})[0]||D.servicios[0]; return Object.assign({},s,ov); }
  function serviciosLista() { var ov=get('servicios_custom',{}); return D.servicios.map(function(s){var o=ov[s.id]||{};return Object.assign({},s,o);}); }
  function ajustes() {
    var a = get('ajustes', null);
    if (!a) { a = { duracion: {}, sillas: {} }; D.servicios.forEach(function (s) { a.duracion[s.id] = s.min; }); D.locales.forEach(function (l) { a.sillas[l.id] = l.sillas; }); }
    return a;
  }
  function barberos() {
    var ov = get('barberos', {});
    var eliminados = get('barberos_eliminados', []);
    var nuevos = get('barberos_nuevos', []);
    var base = D.barberos.filter(function(b){ return eliminados.indexOf(b.id)===-1; });
    return base.concat(nuevos).map(function(b) {
      var o = ov[b.id] || {};
      return Object.assign({}, b, { nombre: o.nombre||b.nombre, activo: o.activo!==undefined?o.activo:(b.activo!==undefined?b.activo:true), locales: o.locales||b.locales||['membrillar'], diaLibre: o.diaLibre!==undefined?o.diaLibre:(b.diaLibre!==undefined?b.diaLibre:null) });
    });
  }
  function barbero(idB) { return barberos().filter(function (b) { return b.id === idB; })[0] || null; }
  function barberosDe(idL) { return barberos().filter(function (b) { return b.activo && b.locales.indexOf(idL) !== -1; }); }
  function nombreBarbero(idB) { var b = idB ? barbero(idB) : null; return b ? b.nombre : 'Primer disponible'; }

  /* Semilla de la demo (solo una vez por versión; el panel puede forzarla) */
  function semilla(forzar) {
    if (!forzar && get('semilla', 0) === D.version) return;
    set('reservas', []); set('bloqueos', []);
    del('micorte'); del('barberos'); del('ajustes');
    set('semilla', D.version);
  }

  /* Reservas con hora */
  function horasDelDia(fecha) {
    var H = D.horario;
    var abreH = fecha && diaSemana(fecha) === 1 && H.lunesAbre ? H.lunesAbre : H.abre;
    var out = []; for (var m = minutosDe(abreH); m <= minutosDe(H.ultimaHora); m += H.paso) out.push(horaDe(m));
    return out;
  }
  function diaAtiende(isoF) { return D.horario.dias.indexOf(diaSemana(isoF)) !== -1; }
  function reservas() { return get('reservas', []); }
  function reservasDe(fecha, idL) { return reservas().filter(function (r) { return r.fecha === fecha && (!idL || r.local === idL); }).sort(function (a, b) { return minutosDe(a.hora) - minutosDe(b.hora); }); }
  function disponibilidad(fecha, idL, idB, idS) {
    var dur = ajustes().duracion; var durS = dur[idS] || servicio(idS).min;
    var res = reservas().filter(function (r) { return r.fecha === fecha && r.local === idL && r.estado === 'confirmada'; });
    var blo = get('bloqueos', []).filter(function (b) { return b.fecha === fecha && b.local === idL; });
    var activos = barberosDe(idL); var cupo = Math.min(Math.max(1, ajustes().sillas[idL] || 1), Math.max(1, activos.length));
    var esHoy = fecha === hoy(); var ahoraM = minutosDe(horaAhora()); var cierraM = minutosDe(D.horario.cierra);
    function solapa(a1, a2, b1, b2) { return a1 < b2 && b1 < a2; }
    return horasDelDia(fecha).map(function (h) {
      var m = minutosDe(h); var fin = m + durS; var libre = true; var motivo = '';
      if (fin > cierraM) { libre = false; motivo = 'cierre'; }
      if (libre && esHoy && m <= ahoraM + 15) { libre = false; motivo = 'pasó'; }
      if (libre) {
        var bloqueado = blo.some(function (b) { return (b.barbero === 'todos' || (idB && b.barbero === idB)) && solapa(m, fin, minutosDe(b.desde), minutosDe(b.hasta)); });
        if (bloqueado) { libre = false; motivo = 'bloqueada'; }
      }
      if (libre) {
        var enHora = res.filter(function (r) { return solapa(m, fin, minutosDe(r.hora), minutosDe(r.hora) + (dur[r.servicio] || 30)); });
        if (enHora.length >= cupo) { libre = false; motivo = 'ocupada'; }
        else if (idB && enHora.some(function (r) { return r.barbero === idB; })) { libre = false; motivo = 'ocupada'; }
      }
      return { hora: h, libre: libre, motivo: motivo };
    });
  }
  function crearReserva(datos) {
    var r = reservas(); var n = Object.assign({ id: id(), estado: 'confirmada', creada: Date.now(), propio: true }, datos);
    r.push(n); set('reservas', r); return n;
  }
  function actualizarReserva(idR, cambios) { set('reservas', reservas().map(function (x) { return x.id === idR ? Object.assign({}, x, cambios) : x; })); }

  /* horasDisponibles: devuelve { fecha: ['10:00','10:30',...] } para los próximos 14 días */
  function horasDisponibles(idL, idB, durMin) {
    var out = {};
    var h0 = hoy();
    var ajs = ajustes();
    var cierraM = minutosDe(D.horario.cierra);
    var barbActual = idB ? barbero(idB) : null;
    for (var i = 0; i < 14; i++) {
      (function (f) {
        if (!diaAtiende(f)) return;
        if (barbActual && barbActual.diaLibre && barbActual.diaLibre === diaSemana(f)) return;
        var esHoy = f === h0;
        var ahoraM = esHoy ? minutosDe(horaAhora()) : -1;
        var blo = get('bloqueos', []).filter(function (b) {
          return b.fecha === f && b.local === idL && (b.barbero === 'todos' || (idB && b.barbero === idB));
        });
        var res = reservas().filter(function (r) {
          return r.fecha === f && r.local === idL && r.estado === 'confirmada';
        });
        var activos = barberosDe(idL);
        var cupo = Math.min(Math.max(1, ajs.sillas[idL] || 1), Math.max(1, activos.length));
        var libres = horasDelDia(f).filter(function (hh) {
          var m = minutosDe(hh); var fin = m + durMin;
          if (fin > cierraM) return false;
          if (esHoy && m <= ahoraM + 15) return false;
          if (blo.some(function (bl) { return m < minutosDe(bl.hasta) && fin > minutosDe(bl.desde); })) return false;
          var enHora = res.filter(function (rv) {
            var rFin = minutosDe(rv.hora) + (ajs.duracion[rv.servicio] || 30);
            return m < rFin && fin > minutosDe(rv.hora);
          });
          if (enHora.length >= cupo) return false;
          if (idB && enHora.some(function (rv) { return rv.barbero === idB; })) return false;
          return true;
        });
        if (libres.length) out[f] = libres;
      })(sumarDias(h0, i));
    }
    return out;
  }

  function estadoFila() { return estadoApertura().texto; }

  w.HC = {
    get: get, set: set, del: del, id: id, onCambio: onCambio,
    hoy: hoy, horaAhora: horaAhora, sumarDias: sumarDias, diaSemana: diaSemana, fmtCorta: fmtCorta, fmtLarga: fmtLarga, DIAS: DIAS, DIAS_C: DIAS_C,
    clp: clp, minutosDe: minutosDe, horaDe: horaDe, haceMin: haceMin, abreHoy: abreHoy, estadoApertura: estadoApertura,
    local: local, servicio: servicio, serviciosLista: serviciosLista, ajustes: ajustes, barberos: barberos, barbero: barbero, barberosDe: barberosDe, nombreBarbero: nombreBarbero,
    semilla: semilla,
    horasDelDia: horasDelDia, diaAtiende: diaAtiende, reservas: reservas, reservasDe: reservasDe, disponibilidad: disponibilidad, crearReserva: crearReserva, actualizarReserva: actualizarReserva,
    horasDisponibles: horasDisponibles, estadoFila: estadoFila
  };
})(window);
