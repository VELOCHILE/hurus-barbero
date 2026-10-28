/* Hurus · panel. PIN dueño 5001; barberos Membrillar 1001-1009, Colón 2001-2004. v10. */
(function () {
  'use strict';
  var D = window.HURUS, C = window.HC; var PIN = '5001';
  C.semilla(false);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var toastT; function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2800); }
  function fmtTel(d) { return d ? '+56 9 ' + d.slice(3, 7) + ' ' + d.slice(7) : 'sin teléfono'; }
  function opts(arr, sel, label, value) { return arr.map(function (x) { var v = value(x); return '<option value="' + esc(v) + '"' + (v === sel ? ' selected' : '') + '>' + esc(label(x)) + '</option>'; }).join(''); }

  /* PINs barberos: pedro→1001 ignacio→1002 gonzalo→1003 joaquin-estay→1004 joaquin-vargas→1005 jose→1006 hans→1007 camilo→1008 kevin→1009 | juan-camilo→2001 jeremy→2002 dilan→2003 nicolas→2004 */
  var BARB_PINS = {'pedro':'1001','ignacio':'1002','gonzalo':'1003','joaquin-estay':'1004','joaquin-vargas':'1005','jose':'1006','hans':'1007','camilo':'1008','kevin':'1009','juan-camilo':'2001','jeremy':'2002','dilan':'2003','nicolas':'2004'};
  var PIN_A_BARB = {}; Object.keys(BARB_PINS).forEach(function(id){ PIN_A_BARB[BARB_PINS[id]] = id; });
  var modoBarb = false; var barbLogueado = null;

  var pinOk = false; var pinGuardado = ''; try { pinGuardado = sessionStorage.getItem('hurus:panel') || ''; } catch (e) {}
  pinOk = (pinGuardado === PIN || !!PIN_A_BARB[pinGuardado]);
  function entrar(pinUsado) {
    modoBarb = (pinUsado !== PIN); barbLogueado = modoBarb ? (PIN_A_BARB[pinUsado] || null) : null;
    pinOk = true; try { sessionStorage.setItem('hurus:panel', pinUsado); } catch (e) {}
    $('#pin').style.display = 'none'; $('#app').classList.add('show');
    if (modoBarb) {
      $$('[data-tab="bloqueos"],[data-tab="barberos"],[data-tab="stats"],[data-tab="ajustes"],[data-tab="admin"]').forEach(function(b){ b.style.display='none'; });
      tab = 'agendas'; agBarb = barbLogueado;
    }
    pintar();
  }
  $('#pin-form').addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('#pin-in').value.trim();
    if (v === PIN || PIN_A_BARB[v]) entrar(v); else { $('#pin-err').textContent = 'Ese PIN no es. Prueba de nuevo.'; $('#pin-in').value = ''; $('#pin-in').focus(); }
  });
  $('#salir').addEventListener('click', function () { try { sessionStorage.removeItem('hurus:panel'); } catch (e) {} location.reload(); });

  /* Tabs */
  var tab = 'hoy'; var hoyFecha = C.hoy(); var hoyLocal = ''; var agBarb = '';
  var statsDesde = '', statsHasta = C.hoy();
  function moverFecha(fecha, dias) {
    var p = fecha.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0);
    d.setDate(d.getDate() + dias);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function prepararRangoStats() {
    if (!statsDesde) { var p = C.hoy().split('-'); statsDesde = p[0] + '-' + p[1] + '-01'; }
  }
  $('#tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (!b) return; tab = b.getAttribute('data-tab'); $$('.tab').forEach(function (t) { t.setAttribute('aria-selected', t === b); }); pintar(); });
  function contadores() {
    var hoyR = C.reservasDe(C.hoy()).filter(function (r) { return r.estado === 'confirmada'; }).length;
    $('#tab-hoy').innerHTML = 'Hoy' + (hoyR ? '<span class="n">' + hoyR + '</span>' : '');
  }
  function pintar() { contadores(); var v = $('#vista'); v.innerHTML = ({ hoy: vHoy, bloqueos: vBloqueos, barberos: vBarberos, agendas: vAgendas, stats: vStats, ajustes: vAjustes, admin: vAdmin, instructivo: vInstructivo })[tab](); }

  /* ----- Hoy ----- */
  function vHoy() {
    var rs = C.reservasDe(hoyFecha, hoyLocal || null);
    if (modoBarb && barbLogueado) { rs = rs.filter(function(r){ return r.barbero === barbLogueado; }); }
    var conf = rs.filter(function (r) { return r.estado === 'confirmada'; });
    var h = '<div class="fila-ctrl"><div class="campo"><label for="h-fecha">Día</label><input id="h-fecha" type="date" value="' + hoyFecha + '"></div>' +
      '<div class="campo"><label for="h-local">Local</label><select id="h-local"><option value="">Los dos locales</option>' + opts(D.locales, hoyLocal, function (l) { return l.nombre; }, function (l) { return l.id; }) + '</select></div>' +
      '<button class="btn ghost sm" type="button" data-hoy>Ver hoy</button></div>' +
      '<div class="kpis"><div class="kpi"><b>' + conf.length + '</b><span>horas reservadas</span></div><div class="kpi"><b>' + rs.filter(function (r) { return r.estado === 'atendida'; }).length + '</b><span>atendidos</span></div><div class="kpi"><b>' + rs.filter(function (r) { return r.estado === 'no_vino'; }).length + '</b><span>no vinieron</span></div></div>';
    h += '<div class="card"><h2>Agenda del ' + esc(C.fmtLarga(hoyFecha)) + '<span>' + (C.diaAtiende(hoyFecha) ? C.horasDelDia(hoyFecha)[0] + ' a ' + D.horario.cierra : 'sin atención') + '</span></h2>';
    if (!rs.length) h += '<div class="vacio">No hay reservas ese día. Las que entren desde el sitio aparecen acá al tiro.</div>';
    else h += '<div class="lista">' + rs.map(function (r) {
      var hecho = r.estado !== 'confirmada';
      var badge = { atendida: '<span class="badge ok">atendido</span>', no_vino: '<span class="badge">no vino</span>', cancelada: '<span class="badge">cancelada</span>' }[r.estado] || '';
      return '<div class="item' + (hecho ? ' hecho' : '') + '"><div class="h">' + r.hora + '</div><div class="q"><b>' + esc(r.nombre) + badge + '</b><small>' + esc(C.servicio(r.servicio).nombre) + ' · ' + esc(C.nombreBarbero(r.barbero)) + ' · ' + esc(C.local(r.local).nombre) + ' · ' + fmtTel(r.tel) + '</small></div>' +
        (hecho ? '' : '<div class="acts"><button class="btn sm" type="button" data-res="atendida" data-id="' + r.id + '">Atendido</button><button class="btn ghost sm" type="button" data-res="no_vino" data-id="' + r.id + '">No vino</button><button class="btn rojo sm" type="button" data-res="cancelada" data-id="' + r.id + '">Cancelar</button></div>') + '</div>';
    }).join('') + '</div>';
    h += '<details><summary style="cursor:pointer;color:var(--text-secondary)">Agregar una reserva a mano</summary><form class="form inline" id="f-res" style="margin-top:12px">' +
      '<div class="campo"><label>Nombre</label><input name="nombre" required></div>' +
      '<div class="campo"><label>Local</label><select name="local">' + opts(D.locales, hoyLocal || 'membrillar', function (l) { return l.nombre; }, function (l) { return l.id; }) + '</select></div>' +
      '<div class="campo"><label>Servicio</label><select name="servicio">' + opts(D.servicios, '', function (s) { return s.nombre; }, function (s) { return s.id; }) + '</select></div>' +
      '<div class="campo"><label>Barbero</label><select name="barbero"><option value="">Primer disponible</option>' + opts(C.barberos(), '', function (b) { return b.nombre; }, function (b) { return b.id; }) + '</select></div>' +
      '<div class="campo"><label>Hora</label><select name="hora">' + opts(C.horasDelDia(hoyFecha), '', function (x) { return x; }, function (x) { return x; }) + '</select></div>' +
      '<button class="btn sm" type="submit">Guardar</button></form></details></div>';
    var prox = C.reservas().filter(function (r) { return r.estado === 'confirmada' && r.fecha >= C.hoy() && (!hoyLocal || r.local === hoyLocal) && (!modoBarb || !barbLogueado || r.barbero === barbLogueado); }).sort(function (a, b) { return (a.fecha + a.hora).localeCompare(b.fecha + b.hora); });
    h += '<div class="card"><h2>Próximas reservas<span>' + prox.length + ' en total</span></h2>' + (prox.length ? '<div class="lista">' + prox.map(function (r) {
      return '<div class="item"><div class="h">' + r.hora + '</div><div class="q"><b>' + esc(r.nombre) + (r.propio ? '<span class="badge gold">desde la web</span>' : '') + '</b><small>' + esc(C.fmtLarga(r.fecha)) + ' · ' + esc(C.servicio(r.servicio).nombre) + ' · ' + esc(C.nombreBarbero(r.barbero)) + ' · ' + esc(C.local(r.local).nombre) + ' · ' + fmtTel(r.tel) + '</small></div><div class="acts"><button class="btn ghost sm" type="button" data-ver-dia="' + r.fecha + '">Ver ese día</button><button class="btn rojo sm" type="button" data-res="cancelada" data-id="' + r.id + '">Cancelar</button></div></div>';
    }).join('') + '</div>' : '<div class="vacio">Todavía no hay reservas. Haz una en la web (en este mismo navegador) y aparece acá.</div>') + '</div>';
    return h;
  }

  /* ----- Bloqueos ----- */
  function vBloqueos() {
    var bs = C.get('bloqueos', []).sort(function (a, b) { return (a.fecha + a.desde).localeCompare(b.fecha + b.desde); });
    var horas = C.horasDelDia().concat([D.horario.cierra]);
    var h = '<div class="card"><h2>Bloquear horas<span>para almuerzo, salidas o días cerrados</span></h2><form class="form inline" id="f-blo">' +
      '<div class="campo"><label>Local</label><select name="local">' + opts(D.locales, '', function (l) { return l.nombre; }, function (l) { return l.id; }) + '</select></div>' +
      '<div class="campo"><label>Barbero</label><select name="barbero"><option value="todos">Todos</option>' + opts(C.barberos(), '', function (b) { return b.nombre; }, function (b) { return b.id; }) + '</select></div>' +
      '<div class="campo"><label>Día</label><input name="fecha" type="date" value="' + C.hoy() + '" required></div>' +
      '<div class="campo"><label>Desde</label><select name="desde">' + opts(horas, '13:00', function (x) { return x; }, function (x) { return x; }) + '</select></div>' +
      '<div class="campo"><label>Hasta</label><select name="hasta">' + opts(horas, '14:00', function (x) { return x; }, function (x) { return x; }) + '</select></div>' +
      '<button class="btn sm" type="submit">Bloquear</button></form></div>';
    h += '<div class="card"><h2>Bloqueos activos<span>' + bs.length + '</span></h2>' + (bs.length ? '<div class="lista">' + bs.map(function (b) {
      return '<div class="item"><div class="h">' + b.desde + '</div><div class="q"><b>' + esc(C.fmtCorta(b.fecha)) + ' · ' + b.desde + ' a ' + b.hasta + '</b><small>' + esc(C.local(b.local).nombre) + ' · ' + (b.barbero === 'todos' ? 'todos los barberos' : esc(C.nombreBarbero(b.barbero))) + '</small></div><div class="acts"><button class="btn rojo sm" type="button" data-blo="' + b.id + '">Quitar</button></div></div>';
    }).join('') + '</div>' : '<div class="vacio">Sin bloqueos. Las horas bloqueadas no se pueden reservar desde el sitio.</div>') + '</div>';
    return h;
  }

  /* ----- Barberos ----- */
  var DIAS_LIBRES = [['','Sin día libre'],['1','Lunes'],['2','Martes'],['3','Miércoles'],['4','Jueves']];
  function vBarberos() {
    return '<div class="card"><h2>Barberos<span>quién atiende y dónde</span></h2><div class="lista">' + C.barberos().map(function (b) {
      var selDia = DIAS_LIBRES.map(function(d){ return '<option value="'+esc(d[0])+'"'+(String(b.diaLibre||'')===d[0]?' selected':'')+'>'+esc(d[1])+'</option>'; }).join('');
      return '<div class="item"><div class="h pos">' + esc(b.nombre.charAt(0)) + '</div><div class="q"><b>' + esc(b.nombre) + (b.apodo ? ' «' + esc(b.apodo) + '»' : '') + (b.activo ? '' : '<span class="badge">fuera</span>') + '</b><small>' + b.menciones + ' reseñas lo nombran en Google</small></div>' +
        '<div class="acts"><label class="toggle"><input type="checkbox" data-bar="activo" data-id="' + b.id + '"' + (b.activo ? ' checked' : '') + '> Atiende</label>' +
        D.locales.map(function (l) { return '<label class="toggle"><input type="checkbox" data-bar="local" data-local="' + l.id + '" data-id="' + b.id + '"' + (b.locales.indexOf(l.id) !== -1 ? ' checked' : '') + '> ' + esc(l.nombre) + '</label>'; }).join('') +
        '<span style="font-size:.78rem;color:var(--text-muted);align-self:center">Día libre:</span><select data-bar="diaLibre" data-id="' + esc(b.id) + '" style="height:32px;padding:2px 8px;border-radius:4px;border:1px solid var(--rule-strong);background:var(--panel-2);color:var(--text-primary);font-size:.82rem">' + selDia + '</select>' +
        '</div></div>';
    }).join('') + '</div></div>';
  }

  /* ----- Agendas por barbero ----- */
  function vAgendas() {
    var barbs = C.barberos();
    var barbNomAg = ''; if (agBarb) { var bObjAg = C.barbero(agBarb); barbNomAg = bObjAg ? (bObjAg.nombre + (bObjAg.apodo ? ' «'+bObjAg.apodo+'»' : '')) : agBarb; }
    var h = '<div class="card"><h2>Agenda por barbero<span>reservas confirmadas próximas</span></h2>' +
      '<div class="fila-ctrl"><div class="campo"><label for="ag-barb">Barbero</label>' +
      (modoBarb
        ? '<input id="ag-barb" type="text" value="' + esc(barbNomAg) + '" readonly style="background:var(--panel-2);color:var(--text-secondary);cursor:default">'
        : '<select id="ag-barb"><option value="">— Elige un barbero —</option>' +
          barbs.map(function (b) {
            var locs = b.locales.map(function (l) { return C.local(l).nombre; }).join(', ');
            return '<option value="' + esc(b.id) + '"' + (b.id === agBarb ? ' selected' : '') + '>' + esc(b.nombre) + (b.apodo ? ' «' + esc(b.apodo) + '»' : '') + ' · ' + esc(locs) + '</option>';
          }).join('') + '</select>'
      ) + '</div></div>';
    if (agBarb) {
      var barb = C.barbero(agBarb);
      var prox = C.reservas().filter(function (r) {
        return r.estado === 'confirmada' && r.fecha >= C.hoy() && r.barbero === agBarb;
      }).sort(function (a, b) { return (a.fecha + a.hora).localeCompare(b.fecha + b.hora); });
      h += '<div class="card" style="margin-top:0"><h2>' + esc(barb ? barb.nombre : agBarb) + '<span>' + prox.length + ' reservas próximas</span></h2>';
      if (barb && barb.diaLibre) {
        var dlNombre = (DIAS_LIBRES.filter(function(d){return d[0]===String(barb.diaLibre);})[0]||['',''])[1];
        h += '<p class="nota" style="margin-bottom:8px">Día libre semanal: <strong>' + esc(dlNombre) + '</strong> (no aparece disponible en el sitio)</p>';
      }
      if (!prox.length) {
        h += '<div class="vacio">No hay reservas próximas para este barbero.</div>';
      } else {
        h += '<div class="lista">' + prox.map(function (r) {
          return '<div class="item"><div class="h">' + r.hora + '</div><div class="q"><b>' + esc(r.nombre || '(sin nombre)') + '</b><small>' + esc(C.fmtLarga(r.fecha)) + ' · ' + esc(C.servicio(r.servicio).nombre) + ' · ' + esc(C.local(r.local).nombre) + '</small></div></div>';
        }).join('') + '</div>';
      }
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  /* ----- Ajustes ----- */
  function vAjustes() {
    var a = C.ajustes();
    return '<div class="dos"><div class="card"><h2>Duración por servicio<span>minutos</span></h2><div class="form" id="f-dur">' + D.servicios.map(function (s) {
      return '<div class="campo"><label>' + esc(s.nombre) + '</label><input type="number" min="15" max="120" step="5" data-dur="' + s.id + '" value="' + (a.duracion[s.id] || s.min) + '"></div>';
    }).join('') + '</div></div>' +
      '<div class="card"><h2>Sillones por local<span>cuántos cortan a la vez</span></h2><div class="form">' + D.locales.map(function (l) {
        return '<div class="campo"><label>' + esc(l.nombre) + '</label><input type="number" min="1" max="8" data-sillas="' + l.id + '" value="' + (a.sillas[l.id] || l.sillas) + '"></div>';
      }).join('') + '</div><p class="nota">Con esto se calcula cuántas reservas caben a la misma hora.</p></div></div>' +
      '<div class="card"><h2>Demo<span>datos ilustrativos</span></h2><p class="nota">Reiniciar borra reservas, bloqueos y ajustes de este navegador.</p><div><button class="btn ghost sm" type="button" id="reiniciar">Reiniciar la demo</button></div></div>';
  }

  /* ----- Administrador ----- */
  function vAdmin() {
    var barbs = C.barberos();
    var servs = C.serviciosLista ? C.serviciosLista() : D.servicios;
    var DIAS_A = [['','Sin día libre'],['1','Lunes'],['2','Martes'],['3','Miércoles'],['4','Jueves'],['5','Viernes'],['6','Sábado']];
    var h = '<div class="card"><h2>Barberos<span>agregar, editar o eliminar</span></h2><div class="lista" id="admin-barbs">';
    barbs.forEach(function(b) {
      var selDia = DIAS_A.map(function(d){ return '<option value="'+esc(d[0])+'"'+(String(b.diaLibre||'')===d[0]?' selected':'')+'>'+esc(d[1])+'</option>'; }).join('');
      h += '<div class="item">' +
        '<div class="h pos">'+esc((b.nombre||'?').charAt(0).toUpperCase())+'</div>' +
        '<div class="q">' +
          '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
            '<input type="text" value="'+esc(b.nombre)+'" data-admin-nombre="'+esc(b.id)+'" style="flex:1;min-width:130px;min-height:34px;padding:4px 10px;border-radius:4px;border:1px solid var(--rule-strong);background:var(--panel-2);color:var(--text-primary);font-size:.95rem">' +
          '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;align-items:center">' +
            D.locales.map(function(l){ return '<label class="toggle"><input type="checkbox" data-bar="local" data-local="'+l.id+'" data-id="'+esc(b.id)+'"'+(b.locales.indexOf(l.id)!==-1?' checked':'')+'>'+esc(l.nombre)+'</label>'; }).join('') +
            '<label class="toggle"><input type="checkbox" data-bar="activo" data-id="'+esc(b.id)+'"'+(b.activo?' checked':'')+'>Atiende</label>' +
            '<span style="font-size:.78rem;color:var(--text-muted)">Día libre:</span>' +
            '<select data-bar="diaLibre" data-id="'+esc(b.id)+'" style="height:28px;padding:1px 6px;border-radius:4px;border:1px solid var(--rule-strong);background:var(--panel-2);color:var(--text-primary);font-size:.8rem">'+selDia+'</select>' +
          '</div>' +
        '</div>' +
        '<div class="acts">' +
          '<button class="btn sm" type="button" data-admin-save="'+esc(b.id)+'">Guardar nombre</button>' +
          '<button class="btn rojo sm" type="button" data-admin-del="'+esc(b.id)+'">Eliminar</button>' +
        '</div>' +
      '</div>';
    });
    h += '</div>';
    h += '<details style="margin-top:10px"><summary style="cursor:pointer;color:var(--text-secondary);padding:8px 0;user-select:none">＋ Agregar barbero nuevo</summary>' +
      '<form class="form inline" id="f-nuevo-barb" style="margin-top:10px">' +
        '<div class="campo"><label>Nombre</label><input name="nombre" required placeholder="Ej: Carlos"></div>' +
        '<div class="campo"><label>Local</label><select name="local">' + D.locales.map(function(l){ return '<option value="'+esc(l.id)+'">'+esc(l.nombre)+'</option>'; }).join('') + '</select></div>' +
        '<button class="btn sm" type="submit">Agregar</button>' +
      '</form></details></div>';
    h += '<div class="card"><h2>Servicios<span>nombre · precios · duración</span></h2><div class="lista">';
    servs.forEach(function(s) {
      h += '<div class="item">' +
        '<div class="h" style="font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;min-width:55px;color:var(--text-muted)">'+esc(s.id)+'</div>' +
        '<div class="q">' +
          '<input type="text" value="'+esc(s.nombre)+'" data-srv-nombre="'+esc(s.id)+'" style="width:100%;min-height:34px;padding:4px 10px;border-radius:4px;border:1px solid var(--rule-strong);background:var(--panel-2);color:var(--text-primary);font-size:.95rem">' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">' +
            '<div class="campo"><label style="font-size:.78rem">Reserva $</label><input type="number" min="0" step="500" value="'+esc(s.precio)+'" data-srv-precio="'+esc(s.id)+'" style="width:100px;min-height:32px;padding:3px 8px;border-radius:4px;border:1px solid var(--rule-strong);background:var(--panel-2);color:var(--text-primary)"></div>' +
            '<div class="campo"><label style="font-size:.78rem">Efectivo $</label><input type="number" min="0" step="500" value="'+esc(s.efectivo||s.precio)+'" data-srv-ef="'+esc(s.id)+'" style="width:100px;min-height:32px;padding:3px 8px;border-radius:4px;border:1px solid var(--rule-strong);background:var(--panel-2);color:var(--text-primary)"></div>' +
            '<div class="campo"><label style="font-size:.78rem">Min.</label><input type="number" min="15" max="120" step="5" value="'+esc(s.min)+'" data-srv-min="'+esc(s.id)+'" style="width:70px;min-height:32px;padding:3px 8px;border-radius:4px;border:1px solid var(--rule-strong);background:var(--panel-2);color:var(--text-primary)"></div>' +
          '</div>' +
        '</div>' +
        '<div class="acts"><button class="btn sm" type="button" data-srv-save="'+esc(s.id)+'">Guardar</button></div>' +
      '</div>';
    });
    h += '</div></div>';
    return h;
  }

  /* ----- Acciones ----- */
  var vista = $('#vista');
  vista.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-hoy')) { hoyFecha = C.hoy(); pintar(); return; }
    if (b.hasAttribute('data-stats-dias')) {
      statsHasta = C.hoy(); statsDesde = moverFecha(statsHasta, 1 - (+b.getAttribute('data-stats-dias')));
      pintar(); return;
    }
    if (b.hasAttribute('data-ver-dia')) { hoyFecha = b.getAttribute('data-ver-dia'); pintar(); window.scrollTo(0, 0); return; }
    if (b.hasAttribute('data-res')) {
      var est = b.getAttribute('data-res'), idR = b.getAttribute('data-id');
      C.actualizarReserva(idR, { estado: est });
      toast({ atendida: 'Marcado como atendido', no_vino: 'Marcado como no vino', cancelada: 'Hora cancelada' }[est] || 'Listo');
      pintar(); return;
    }
    if (b.hasAttribute('data-blo')) { C.set('bloqueos', C.get('bloqueos', []).filter(function (x) { return x.id !== b.getAttribute('data-blo'); })); toast('Bloqueo quitado'); pintar(); return; }
    if (b.id === 'reiniciar') { if (confirm('¿Reiniciar la demo? Se borran reservas y ajustes de este navegador.')) { C.semilla(true); toast('Demo reiniciada'); pintar(); } return; }
    if (b.hasAttribute('data-admin-save')) {
      var bid = b.getAttribute('data-admin-save');
      var inp = vista.querySelector('[data-admin-nombre="'+bid+'"]');
      var nom = inp ? inp.value.trim() : '';
      if (!nom) { toast('Escribe un nombre'); return; }
      var ov = C.get('barberos', {}); if (!ov[bid]) ov[bid] = {}; ov[bid].nombre = nom;
      C.set('barberos', ov); toast('Nombre guardado'); pintar(); return;
    }
    if (b.hasAttribute('data-admin-del')) {
      var bid2 = b.getAttribute('data-admin-del');
      var bObj = C.barbero(bid2); var bNom = bObj ? bObj.nombre : bid2;
      if (!confirm('¿Eliminar a '+bNom+'? No se puede deshacer.')) return;
      var nv = C.get('barberos_nuevos', []);
      if (nv.some(function(x){ return x.id===bid2; })) {
        C.set('barberos_nuevos', nv.filter(function(x){ return x.id!==bid2; }));
      } else {
        var el = C.get('barberos_eliminados', []); if (el.indexOf(bid2)===-1){ el.push(bid2); C.set('barberos_eliminados', el); }
      }
      toast('Barbero eliminado'); pintar(); return;
    }
    if (b.hasAttribute('data-srv-save')) {
      var sid = b.getAttribute('data-srv-save');
      var row = b.closest('.item');
      var ov3 = C.get('servicios_custom', {}); if (!ov3[sid]) ov3[sid] = {};
      var n3 = row.querySelector('[data-srv-nombre="'+sid+'"]'); if (n3&&n3.value.trim()) ov3[sid].nombre = n3.value.trim();
      var pr = row.querySelector('[data-srv-precio="'+sid+'"]'); if (pr&&!isNaN(+pr.value)) ov3[sid].precio = +pr.value;
      var ef = row.querySelector('[data-srv-ef="'+sid+'"]'); if (ef&&!isNaN(+ef.value)) ov3[sid].efectivo = +ef.value;
      var mn = row.querySelector('[data-srv-min="'+sid+'"]'); if (mn&&!isNaN(+mn.value)) ov3[sid].min = +mn.value;
      C.set('servicios_custom', ov3);
      if (mn&&!isNaN(+mn.value)){ var aj=C.ajustes(); aj.duracion[sid]=+mn.value; C.set('ajustes',aj); }
      toast('Servicio actualizado'); return;
    }
  });
  vista.addEventListener('submit', function (e) {
    var f = e.target; e.preventDefault(); var fd = new FormData(f);
    if (f.id === 'f-res') {
      C.crearReserva({ local: fd.get('local'), servicio: fd.get('servicio'), barbero: fd.get('barbero') || null, fecha: hoyFecha, hora: fd.get('hora'), nombre: String(fd.get('nombre')).trim(), tel: '', propio: false });
      toast('Reserva guardada'); pintar(); return;
    }
    if (f.id === 'f-blo') {
      var desde = fd.get('desde'), hasta = fd.get('hasta');
      if (C.minutosDe(hasta) <= C.minutosDe(desde)) { toast('La hora final tiene que ser después de la inicial'); return; }
      var bs = C.get('bloqueos', []); bs.push({ id: C.id(), local: fd.get('local'), barbero: fd.get('barbero'), fecha: fd.get('fecha'), desde: desde, hasta: hasta }); C.set('bloqueos', bs);
      toast('Horas bloqueadas'); pintar(); return;
    }
    if (f.id === 'f-nuevo-barb') {
      var nom4 = String(fd.get('nombre')||'').trim();
      if (!nom4) { toast('Escribe un nombre'); return; }
      var nv2 = C.get('barberos_nuevos', []);
      nv2.push({ id: C.id(), nombre: nom4, locales: [fd.get('local')], activo: true, menciones: 0, diaLibre: null });
      C.set('barberos_nuevos', nv2); toast('Barbero agregado'); pintar(); return;
    }
  });
  vista.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'h-fecha') { hoyFecha = t.value || C.hoy(); pintar(); return; }
    if (t.id === 'h-local') { hoyLocal = t.value; pintar(); return; }
    if (t.id === 'ag-barb') { agBarb = t.value; pintar(); return; }
    if (t.id === 'stats-desde' || t.id === 'stats-hasta') {
      if (t.id === 'stats-desde') statsDesde = t.value;
      else statsHasta = t.value;
      if (statsDesde && statsHasta && statsDesde > statsHasta) {
        toast('La fecha inicial debe ser anterior o igual a la fecha final');
        if (t.id === 'stats-desde') statsDesde = statsHasta;
        else statsHasta = statsDesde;
      }
      pintar(); return;
    }
    if (t.hasAttribute('data-bar')) {
      var ov = C.get('barberos', {}); var b = C.barbero(t.getAttribute('data-id')); var o = ov[b.id] || { activo: b.activo, locales: b.locales.slice(), diaLibre: null };
      if (o.diaLibre === undefined) o.diaLibre = null;
      if (t.getAttribute('data-bar') === 'activo') o.activo = t.checked;
      else if (t.getAttribute('data-bar') === 'diaLibre') o.diaLibre = t.value ? +t.value : null;
      else { var l = t.getAttribute('data-local'); o.locales = o.locales.filter(function (x) { return x !== l; }); if (t.checked) o.locales.push(l); }
      ov[b.id] = o; C.set('barberos', ov); toast('Guardado'); contadores(); return;
    }
    if (t.hasAttribute('data-dur') || t.hasAttribute('data-sillas')) {
      var a = C.ajustes();
      if (t.hasAttribute('data-dur')) a.duracion[t.getAttribute('data-dur')] = Math.max(15, +t.value || 30);
      else a.sillas[t.getAttribute('data-sillas')] = Math.max(1, +t.value || 1);
      C.set('ajustes', a); toast('Guardado'); return;
    }
  });
  /* ---- Estadísticas ---- */
  function barChart(rows, max) {
    if (!rows.length) return '<p class="vacio">Sin datos para este período.</p>';
    return '<div class="stats-chart">' + rows.map(function(r){
      var pct = max > 0 ? Math.round((r.v / max) * 100) : 0;
      return '<div class="stats-row">' +
        '<span class="stats-label" title="'+esc(r.n)+'">'+esc(r.n)+'</span>' +
        '<div class="stats-track"><div class="stats-fill" style="width:'+pct+'%"></div></div>' +
        '<span class="stats-value">'+r.v+'</span>' +
      '</div>';
    }).join('') + '</div>';
  }
  function vStats() {
    prepararRangoStats();
    var todas = C.reservas().filter(function(r){ return r.fecha && r.fecha >= statsDesde && r.fecha <= statsHasta; });
    var esAtendida = function(r){ return r.estado==='atendida'||r.estado==='completada'; };
    var esAusente = function(r){ return r.estado==='no_vino'||r.estado==='ausente'; };
    var atendidas = todas.filter(esAtendida);
    var pendientes = todas.filter(function(r){ return r.estado==='confirmada'; }).length;
    var canceladas = todas.filter(function(r){ return r.estado==='cancelada'; }).length;
    var ausentes = todas.filter(esAusente).length;
    var medibles = atendidas.length + ausentes;
    var asistTasa = medibles ? Math.round(atendidas.length / medibles * 100) : 0;
    var agendadasPorFecha = {};
    todas.forEach(function(r){ if(r.estado!=='cancelada'){ agendadasPorFecha[r.fecha]=(agendadasPorFecha[r.fecha]||0)+1; } });
    /* Los rankings solo cuentan servicios y atenciones realmente realizados. */
    var barbCount = {};
    atendidas.forEach(function(r){ if(r.barbero){ barbCount[r.barbero]=(barbCount[r.barbero]||0)+1; } });
    var topBarb = Object.keys(barbCount).map(function(id){ var b=C.barbero(id); return {n:b?b.nombre:id, v:barbCount[id]}; }).sort(function(a,b){return b.v-a.v;}).slice(0,6);
    var servCount = {};
    atendidas.forEach(function(r){ if(r.servicio){ servCount[r.servicio]=(servCount[r.servicio]||0)+1; } });
    var topServ = Object.keys(servCount).map(function(id){ var s=D.servicios.find(function(x){return x.id===id;}); return {n:s?s.nombre:id, v:servCount[id]}; }).sort(function(a,b){return b.v-a.v;}).slice(0,5);
    /* Semana ordenada según el calendario laboral habitual: lunes a domingo. */
    var DIAS=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    var diasC=[0,0,0,0,0,0,0];
    atendidas.forEach(function(r){ if(r.fecha){ var d=new Date(r.fecha+'T12:00:00'); diasC[(d.getDay()+6)%7]++; } });
    var topDias=DIAS.map(function(n,i){return{n:n,v:diasC[i]};});
    var actividad=Object.keys(agendadasPorFecha).sort().map(function(f){
      var p=f.split('-'); var fecha=new Date(+p[0],+p[1]-1,+p[2],12,0,0);
      return {n:fecha.toLocaleDateString('es-CL',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}),v:agendadasPorFecha[f]};
    });
    var maxBarb = topBarb.length ? Math.max.apply(null,topBarb.map(function(x){return x.v;})) : 1;
    var maxServ = topServ.length ? Math.max.apply(null,topServ.map(function(x){return x.v;})) : 1;
    var maxDias = Math.max.apply(null,diasC)||1;
    var maxActividad = actividad.length ? Math.max.apply(null,actividad.map(function(x){return x.v;})) : 1;
    return '<div class="card"><h2>Período de análisis<span>fecha de la reserva</span></h2>' +
      '<div class="stats-range"><div class="campo"><label for="stats-desde">Desde</label><input id="stats-desde" type="date" value="'+esc(statsDesde)+'" max="'+esc(statsHasta)+'"></div>' +
      '<div class="campo"><label for="stats-hasta">Hasta</label><input id="stats-hasta" type="date" value="'+esc(statsHasta)+'" min="'+esc(statsDesde)+'"></div>' +
      '<div class="stats-shortcuts"><button class="btn ghost sm" type="button" data-stats-dias="7">7 días</button><button class="btn ghost sm" type="button" data-stats-dias="30">30 días</button><button class="btn ghost sm" type="button" data-stats-dias="90">90 días</button></div></div></div>' +
      '<div class="kpis">' +
        '<div class="kpi"><b>'+todas.length+'</b><span>Citas registradas</span></div>' +
        '<div class="kpi"><b>'+atendidas.length+'</b><span>Atendidas</span></div>' +
        '<div class="kpi"><b>'+pendientes+'</b><span>Pendientes</span></div>' +
        '<div class="kpi"><b>'+canceladas+'</b><span>Canceladas</span></div>' +
        '<div class="kpi"><b>'+ausentes+'</b><span>No asistieron</span></div>' +
        '<div class="kpi"><b>'+asistTasa+'%</b><span>Asistencia sobre citas con resultado</span></div>' +
      '</div>' +
      '<p class="stats-note">El panel no registra pagos. Estas cifras muestran reservas y atenciones, no ingresos reales. Las citas canceladas se excluyen de la actividad por fecha; los rankings cuentan solo atenciones completadas.</p>' +
      '<div class="dos">' +
        '<div class="card"><h2>Atenciones por barbero</h2>' + barChart(topBarb, maxBarb) + '</div>' +
        '<div class="card"><h2>Servicios atendidos</h2>' + barChart(topServ, maxServ) + '</div>' +
      '</div>' +
      '<div class="dos"><div class="card"><h2>Atenciones por día de semana<span>lunes a domingo</span></h2>' + barChart(topDias, maxDias) + '</div>' +
      '<div class="card"><h2>Citas por fecha<span>orden cronológico</span></h2>' + barChart(actividad, maxActividad) + '</div></div>';
  }

  /* ----- Instructivo ----- */
  function vInstructivo() {
    return '<div class="card"><h2>Instructivo del panel</h2>' +
      '<div class="lista" style="font-size:.94rem;line-height:1.7;color:var(--text-secondary)">' +
        '<div style="padding:12px 0;border-bottom:1px solid var(--rule)"><b style="color:var(--text-primary);display:block;margin-bottom:4px">📅 Pestaña Hoy</b>Ve y gestiona las reservas del día. Puedes marcar "Atendido", "No vino" o "Cancelar". También puedes agregar reservas a mano si alguien llama por teléfono.</div>' +
        '<div style="padding:12px 0;border-bottom:1px solid var(--rule)"><b style="color:var(--text-primary);display:block;margin-bottom:4px">🚫 Pestaña Bloquear horas</b>Si hay almuerzo, días especiales o el local cierra antes, bloquea el rango acá. Esas horas no aparecen disponibles en el sitio. Para el día completo, bloquea desde la apertura hasta el cierre.</div>' +
        '<div style="padding:12px 0;border-bottom:1px solid var(--rule)"><b style="color:var(--text-primary);display:block;margin-bottom:4px">💈 Pestaña Barberos</b>Marca "Atiende" si el barbero está ese día. Desmarca si no viene y sus horas dejan de aparecer en el sitio de forma inmediata. También puedes cambiar de local.</div>' +
        '<div style="padding:12px 0;border-bottom:1px solid var(--rule)"><b style="color:var(--text-primary);display:block;margin-bottom:4px">📊 Pestaña Estadísticas</b>Muestra reservas, atenciones, barberos más pedidos y servicios más solicitados. El panel no registra pagos: las cifras son de reservas, no de ingresos reales. Puedes filtrar por período (7, 30 o 90 días).</div>' +
        '<div style="padding:12px 0;border-bottom:1px solid var(--rule)"><b style="color:var(--text-primary);display:block;margin-bottom:4px">⚙ Pestaña Ajustes</b>Cambia la duración de los servicios en minutos y el número de sillones por local. Esto afecta cuántas reservas caben a la misma hora.</div>' +
        '<div style="padding:12px 0"><b style="color:var(--text-primary);display:block;margin-bottom:4px">🌙 Modo día / noche</b>El ícono ☀ / 🌙 en la barra superior cambia entre fondo oscuro y fondo claro. Se guarda en este navegador.</div>' +
      '</div>' +
      '<p class="nota" style="margin-top:16px">Si algo no funciona o necesitas ayuda, contacta a VELO: <a href="https://wa.me/56963922308" target="_blank" rel="noopener" style="color:var(--accent)">+56 9 6392 2308</a></p>' +
    '</div>';
  }

  C.onCambio(function () { if (pinOk) pintar(); });
  setInterval(function () { if (pinOk && tab === 'hoy') pintar(); }, 30000);
  if (pinOk) entrar(pinGuardado);
})();
