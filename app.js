/* Hurus Barber Studio · app.js v25 · fila virtual eliminada, precios actualizados */
(function () {
  'use strict';
  var D = window.HURUS, C = window.HC, RES = window.HURUS_RESENAS || [], GG = window.HURUS_GOOGLE || { nota: 4.9, total: 314, dist: {} };
  if (!D || !C) return;
  C.semilla(false);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  /* --- Telón --- */
  var tel = $('#telon');
  if (tel) setTimeout(function(){ tel.classList.add('fuera'); }, 1100);

  /* --- Lenis smooth scroll (solo desktop) --- */
  var lenis;
  var scrollEl = $('#scroll-wrap');
  if (scrollEl && window.Lenis && window.matchMedia('(min-width:900px)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    lenis = new window.Lenis({ wrapper: scrollEl, content: scrollEl, lerp: 0.08, wheelMultiplier: 1, touchMultiplier: 1.6, smoothWheel: true });
    function rafLoop(t){ lenis.raf(t); requestAnimationFrame(rafLoop); }
    requestAnimationFrame(rafLoop);
  }

  /* --- Grid de barberos agrupado por sucursal --- */
  var barberos = D.barberos || [];
  var rail = $('#barb-rail');
  if (rail) {
    (D.locales || []).forEach(function(loc){
      var grupo = barberos.filter(function(b){ return b.locales && b.locales.indexOf(loc.id) !== -1; });
      if (!grupo.length) return;
      var hdr = document.createElement('div');
      hdr.className = 'barb-local-header';
      hdr.innerHTML = '<div class="barb-hdr-inner"><span class="bh-nombre">' + esc(loc.nombre) + '</span><span class="bh-dir">' + esc(loc.direccion) + '</span></div>';
      rail.appendChild(hdr);
      grupo.forEach(function(b){
        var item = document.createElement('div');
        item.className = 'barb-item';
        item.innerHTML =
          '<div class="barb-slide' + (b.foto ? '' : ' barb-slide--sin-foto') + '">' +
            '<img class="barb-slide-img" src="' + esc(b.foto || 'img/barberos/sin-foto.png') + '" alt="' + esc(b.nombre) + '" loading="lazy">' +
          '</div>' +
          '<div class="barb-caption">' +
            '<p class="barb-nome">' + esc(b.nombre) + (b.apodo ? ' <span class="barb-apodo">«' + esc(b.apodo) + '»</span>' : '') + '</p>' +
            '<button class="btn-reservar" type="button" data-reservar-con="' + esc(b.id) + '">Reservar</button>' +
          '</div>';
        rail.appendChild(item);
      });
    });
    /* Scroll reveal escalonado para barberos */
    if (window.IntersectionObserver) {
      var revObs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting) {
            var idx = [].indexOf.call(e.target.parentNode.querySelectorAll('.barb-item'), e.target);
            setTimeout(function(){ e.target.classList.add('visible'); }, Math.min(idx, 12) * 40);
            revObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.05 });
      rail.querySelectorAll('.barb-item').forEach(function(el){ revObs.observe(el); });
    } else {
      rail.querySelectorAll('.barb-item').forEach(function(el){ el.classList.add('visible'); });
    }
  }

  /* --- Stats strip dorado (v20) — inside panel-barberos so snap-scroll reveals it --- */
  var barbPanel = document.querySelector('.panel-barberos');
  if (barbPanel) {
    var statsData = [
      { num: (D.barberos||[]).length || 13, lbl: 'Barberos' },
      { num: (D.locales||[]).length || 2, lbl: 'Locales' },
      { num: '+1.000', lbl: 'Cortes al mes' }
    ];
    var sEl = document.createElement('div');
    sEl.className = 'stats-strip';
    sEl.setAttribute('aria-hidden', 'true');
    sEl.innerHTML = statsData.map(function(s){
      return '<div class="stat-item"><span class="stat-num">' + esc(String(s.num)) + '</span><span class="stat-lbl">' + esc(s.lbl) + '</span></div>';
    }).join('');
    barbPanel.insertBefore(sEl, barbPanel.firstChild);
  }

  /* --- Keyword tape (v19) --- */
  var vpDest = document.getElementById('video-paneles');
  if (vpDest && vpDest.parentNode) {
    var KWS = ['Fade','Degradado','Corte','Barba','Tijera','Precisión','Estilo','Rancagua','Hurus'];
    var tapeItems = KWS.map(function(w){
      return '<span class="kw-word">' + esc(w) + '</span><span class="kw-dot" aria-hidden="true">·</span>';
    }).join('');
    var tapeEl = document.createElement('div');
    tapeEl.className = 'kw-tape';
    tapeEl.setAttribute('aria-hidden','true');
    tapeEl.innerHTML = '<div class="kw-track">' + tapeItems + tapeItems + '</div>';
    vpDest.parentNode.insertBefore(tapeEl, vpDest);
  }

  /* --- Reels de video: sección compacta con carrusel horizontal --- */
  var videosDest = $('#video-paneles');
  if (videosDest && D.videos && D.videos.length) {
    var vSec = document.createElement('section');
    vSec.className = 'panel panel-videos-grid';
    vSec.id = 'p-videos';
    var cards = D.videos.map(function(v, i){
      return '<div class="vg-card" id="vg-' + i + '">' +
        '<video class="vg-video" src="' + esc(v.src) + '" poster="' + esc(v.poster||'') + '" muted loop playsinline></video>' +
        '<div class="vg-overlay"></div>' +
        '</div>';
    }).join('');
    vSec.innerHTML =
      '<div class="vg-head"><p class="kicker-gold">En acción</p><h2 class="sec-titulo">Así trabajamos</h2></div>' +
      '<div class="vg-rail">' + cards + '</div>';
    videosDest.appendChild(vSec);
    if (window.IntersectionObserver) {
      vSec.querySelectorAll('.vg-video').forEach(function(vid){
        var obs = new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if (e.isIntersecting) vid.play(); else vid.pause(); });
        }, { threshold: 0.3, root: scrollEl });
        obs.observe(vid);
      });
    }
  }

  /* --- GSAP animaciones hero --- */
  function initAnimaciones() {
    if (!window.gsap) return;
    var heroLogo = $('.hero-logo');
    var heroTit = $('.hero-titulo');
    var heroSub = $('.hero-sub');
    var heroCta = $('.hero-cta');
    setTimeout(function(){
      if (heroLogo) heroLogo.classList.add('visible');
      setTimeout(function(){
        if (heroTit) heroTit.classList.add('visible');
        if (heroSub) heroSub.classList.add('visible');
        if (heroCta) heroCta.classList.add('visible');
      }, 300);
    }, 1200);
  }

  if (window.gsap) { initAnimaciones(); }
  else { window.addEventListener('load', initAnimaciones); }

  /* --- Tarifa --- */
  var tarEl = $('#tarifa');
  if (tarEl) {
    tarEl.innerHTML = D.tarifa.map(function(t){
      return '<li><span class="t-nom">' + esc(t.nombre) + '<small class="t-dur">' + esc(t.dur) + '</small></span>' +
        '<span class="t-precio"><span class="t-normal">' + C.clp(t.precio) + ' reserva</span><span class="ef-precio">' + C.clp(t.efectivo) + ' efectivo</span></span></li>';
    }).join('');
  }
  var efecEl = $('#efectivo');
  if (efecEl) efecEl.innerHTML =
    '<div class="walkin-callout">' +
      '<strong class="walkin-titulo">Sin reserva = precio en efectivo</strong>' +
      '<span class="walkin-sub">Llegas al local · Te atendemos por orden de llegada</span>' +
    '</div>';

  /* --- Reseñas --- */
  var notaBig = $('#nota-big');
  if (notaBig) notaBig.textContent = String(GG.nota).replace('.', ',');
  var notaStars = $('#nota-stars');
  if (notaStars) {
    var sts = ''; for(var s=0;s<5;s++) sts += '<svg aria-hidden="true"><use href="#i-star"/></svg>';
    notaStars.innerHTML = sts;
  }
  var notaLink = $('#nota-link');
  if (notaLink) { notaLink.textContent = '+' + (Math.floor((GG.total||300)/100)*100) + ' reseñas en Google'; notaLink.href = D.marca.googleUrl; }
  var verGoogle = $('#ver-google');
  if (verGoogle) verGoogle.href = D.marca.googleUrl;
  var muro = $('#muro');
  if (muro) {
    var resList = RES.length ? RES.slice(0,16) : [];
    var cardHtml = resList.map(function(r){
      var sts2=''; for(var k=0;k<(r.nota||5);k++) sts2+='<svg aria-hidden="true"><use href="#i-star"/></svg>';
      return '<div class="resena-card">' +
        '<div class="resena-top"><span class="resena-autor">' + esc(r.autor||r.nombre||'Cliente') + '</span></div>' +
        '<div class="resena-stars">' + sts2 + '</div>' +
        '<p class="resena-txt">' + esc((r.texto||r.t||'').slice(0,140)) + '</p>' +
      '</div>';
    }).join('');
    var track = document.createElement('div');
    track.className = 'marquee-track';
    track.innerHTML = cardHtml + cardHtml;
    muro.appendChild(track);
  }

  /* --- Locales --- */
  var locEl = $('#lista-locales');
  if (locEl) {
    locEl.innerHTML = D.locales.map(function(loc){
      return '<div class="local-card">' +
        '<h3>' + esc(loc.nombre) + '</h3>' +
        '<div class="local-inf">' +
          '<p>' + esc(loc.direccion) + '</p>' +
          '<p>' + esc(loc.horario) + '</p>' +
          '<p>' + esc(loc.horarioNota) + '</p>' +
        '</div>' +
        '<div class="local-acts">' +
          '<a class="btn-red sm" href="' + esc(loc.comoLlegar) + '" target="_blank" rel="noopener" style="min-height:36px;padding:8px 14px;font-size:13px;border-radius:3px;display:inline-flex;align-items:center;text-decoration:none;">Cómo llegar</a>' +
          '<button class="btn-ghost sm" type="button" data-abrir="reserva" style="min-height:36px;padding:8px 14px;font-size:13px;">Reservar</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* --- FAQ — layout dos columnas --- */
  var faqEl = $('#faq');
  if (faqEl) {
    var faqItems = D.faq.map(function(f,i){
      return '<div class="faq-item" id="faq-'+i+'">' +
        '<button class="faq-q" aria-expanded="false" onclick="toggleFaq('+i+')">' +
          esc(f.p) +
          '<svg aria-hidden="true"><use href="#ico-plus"/></svg>' +
        '</button>' +
        '<div class="faq-r">' + esc(f.r) + '</div>' +
      '</div>';
    }).join('');
    var wa = D.marca.whatsapp || '56949607680';
    var faqAside =
      '<div class="faq-aside">' +
        '<div class="faq-stat-card"><div class="fsc-num">+300</div><div class="fsc-lbl">Reseñas en Google</div></div>' +
        '<div class="faq-stat-card"><div class="fsc-num">4,9</div><div class="fsc-lbl">Calificación promedio</div></div>' +
        '<div class="faq-stat-card"><div class="fsc-num">13</div><div class="fsc-lbl">Barberos disponibles</div></div>' +
        '<a class="faq-wa" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#ico-wa"/></svg>¿Más dudas? WhatsApp' +
        '</a>' +
      '</div>';
    faqEl.innerHTML = '<div class="faq-layout"><div class="faq-col">' + faqItems + '</div><div>' + faqAside + '</div></div>';
  }
  window.toggleFaq = function(i){
    var item = $('#faq-'+i);
    if (!item) return;
    var open = item.classList.contains('open');
    $$('.faq-item.open').forEach(function(el){ el.classList.remove('open'); el.querySelector('.faq-q').setAttribute('aria-expanded','false'); });
    if (!open) { item.classList.add('open'); item.querySelector('.faq-q').setAttribute('aria-expanded','true'); }
  };

  /* --- Delegación de clicks: reservar --- */
  document.addEventListener('click', function(e){
    var t = e.target;
    var btn = t.closest('[data-abrir],[data-reservar-con]');
    if (!btn) return;
    var abrir = btn.dataset.abrir;
    var reservarCon = btn.dataset.reservarCon;
    if (reservarCon) { abrirReserva(reservarCon); return; }
    if (abrir === 'reserva') { abrirReserva(); return; }
  });

  /* --- Sistema de reserva (heredado, simplificado) --- */
  var hoja = $('#hoja-reserva');
  var panel = $('#hr-panel');

  function abrirHoja(html) {
    if (!hoja || !panel) return;
    panel.innerHTML = html;
    hoja.showModal ? hoja.showModal() : hoja.setAttribute('open','');
  }
  function cerrarHoja() {
    if (!hoja) return;
    hoja.close ? hoja.close() : hoja.removeAttribute('open');
  }
  if (hoja) { hoja.addEventListener('click', function(e){ if(e.target===hoja) cerrarHoja(); }); }

  function headerReserva(titulo, conBack) {
    return '<div class="hoja-nav">' +
      (conBack ? '<button onclick="window._hBack&&window._hBack()" aria-label="Atrás"><svg><use href="#ico-back"/></svg></button>' : '<span></span>') +
      '<span class="res-titulo">' + titulo + '</span>' +
      '<button onclick="window._hClose()" aria-label="Cerrar"><svg><use href="#ico-x"/></svg></button>' +
    '</div>';
  }
  window._hClose = cerrarHoja;

  function abrirFila() {
    var loc = D.locales[0];
    abrirHoja(headerReserva('Fila sin reserva') +
      '<div class="fila-est">' +
        '<strong>' + C.estadoApertura().texto + '</strong>' +
        '<p style="margin-top:8px;font-size:13px;color:var(--text-secondary)">Llegas al local y el barbero te atiende en orden.</p>' +
      '</div>' +
      '<button class="wa-btn" onclick="window.open(\'https://wa.me/' + D.marca.whatsapp + '\',\'_blank\')">' +
        '<svg width="20" height="20" aria-hidden="true"><use href="#ico-wa"/></svg>Avisar que voy' +
      '</button>');
  }

  function abrirReserva(barberoId) {
    /* Paso 1: elegir local */
    window._hBack = null;
    var dotsHtml = '<div class="paso-ind">' + [0,1,2,3,4].map(function(i){ return '<span class="paso-dot'+(i===0?' act':'')+'"></span>'; }).join('') + '</div>';

    abrirHoja(headerReserva('Solicitar hora') + dotsHtml +
      '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px">Elige el local</p>' +
      D.locales.map(function(loc){
        return '<div class="res-op" data-pick-local="' + loc.id + '">' +
          '<div class="aro">H</div>' +
          '<div><div class="res-nom">' + esc(loc.nombre) + '</div><div class="res-sub">' + esc(loc.direccion) + '</div></div>' +
        '</div>';
      }).join(''));

    if (window._hurusResClick) { try { panel.removeEventListener('click', window._hurusResClick); } catch(e){} }
    panel.addEventListener('click', onReservaClick);
    window._hurusResClick = onReservaClick;
    var barbBuf = barberoId || null;
    var localBuf = null;
    var servBuf = null;
    var diaBuf = null;
    var horaBuf = null;

    function upDots(step){
      $$('.paso-dot').forEach(function(d,i){ d.classList.toggle('act', i<=step); });
    }

    function onReservaClick(e){
      var el = e.target.closest('[data-pick-local],[data-pick-barb],[data-pick-serv],[data-pick-hora]');
      if (!el) return;
      e.stopPropagation();
      if (el.dataset.pickLocal) { localBuf = el.dataset.pickLocal; paso2(); }
      else if ('pickBarb' in el.dataset) { barbBuf = el.dataset.pickBarb; paso3(); }
      else if (el.dataset.pickServ) { servBuf = el.dataset.pickServ; paso4(); }
      else if (el.dataset.pickHora) { horaBuf = el.dataset.pickHora; diaBuf = el.dataset.dia; paso5(); }
    }

    function paso2(){
      upDots(1);
      var barbs = C.barberos().filter(function(b){ return b.activo && b.locales && b.locales.indexOf(localBuf)!==-1; });
      var html = headerReserva('Tu barbero', true) + '<div class="paso-ind">' + [0,1,2,3,4].map(function(i){ return '<span class="paso-dot'+(i<=1?' act':'')+'"></span>'; }).join('') + '</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px">¿Con quién quieres cortarte?</p>' +
        '<div class="res-op" data-pick-barb="">' +
          '<div class="aro">?</div><div><div class="res-nom">Cualquiera disponible</div><div class="res-sub">El primero libre</div></div>' +
        '</div>' +
        barbs.map(function(b){
          return '<div class="res-op" data-pick-barb="' + esc(b.id) + '">' +
            (b.foto ? '<img src="' + esc(b.foto) + '" alt="' + esc(b.nombre) + '" width="40" height="40" loading="lazy">' : '<div class="aro">' + esc(b.nombre.charAt(0)) + '</div>') +
            '<div><div class="res-nom">' + esc(b.nombre) + (b.apodo ? ' «' + esc(b.apodo) + '»' : '') + '</div><div class="res-sub">Membrillar</div></div>' +
          '</div>';
        }).join('');
      panel.innerHTML = html;
      window._hBack = function(){ abrirReserva(null); };
      if (barbBuf !== null) { paso3(); }
    }

    function paso3(){
      upDots(2);
      window._pickServ = function(id){ servBuf = id; paso4(); };
      var html = headerReserva('Servicio', true) + '<div class="paso-ind">' + [0,1,2,3,4].map(function(i){ return '<span class="paso-dot'+(i<=2?' act':'')+'"></span>'; }).join('') + '</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px">¿Qué te hacemos?</p>' +
        D.servicios.map(function(s){
          return '<div class="res-op" data-pick-serv="' + esc(s.id) + '" onclick="window._pickServ&&window._pickServ(\'' + esc(s.id) + '\')">' +
            '<div class="aro"><svg width="18" height="18"><use href="#ico-scissors"/></svg></div>' +
            '<div><div class="res-nom">' + esc(s.nombre) + '</div><div class="res-sub"><span class="res-ef">' + C.clp(s.efectivo||s.precio) + ' ef.</span> · ' + C.clp(s.precio) + ' · ' + s.min + ' min</div></div>' +
          '</div>';
        }).join('');
      panel.innerHTML = html;
      window._hBack = function(){ barbBuf = null; paso2(); };
    }

    function paso4(){
      upDots(3);
      var serv = D.servicios.find(function(s){ return s.id === servBuf; }) || D.servicios[0];
      var horas = C.horasDisponibles(localBuf, barbBuf, serv.min);
      var dias = Object.keys(horas).sort();
      var html = headerReserva('Día y hora', true) + '<div class="paso-ind">' + [0,1,2,3,4].map(function(i){ return '<span class="paso-dot'+(i<=3?' act':'')+'"></span>'; }).join('') + '</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px">Elige cuándo</p>' +
        '<div class="dias-wrap">';
      dias.forEach(function(dia){
        var slots = horas[dia];
        html += '<div class="dia-row"><span class="dia-lbl">' + esc(C.fmtCorta(dia)) + '</span><div class="dia-horas">';
        slots.forEach(function(h){
          html += '<span class="res-cel" data-pick-hora="' + esc(h) + '" data-dia="' + esc(dia) + '">' + esc(h) + '</span>';
        });
        html += '</div></div>';
      });
      html += '</div>';
      panel.innerHTML = html;
      window._hBack = paso3;
    }

    function paso5(){
      upDots(4);
      var serv = D.servicios.find(function(s){ return s.id === servBuf; }) || D.servicios[0];
      var barb = barbBuf ? C.barberos().find(function(b){ return b.id === barbBuf; }) : null;
      var loc = D.locales.find(function(l){ return l.id === localBuf; }) || D.locales[0];
      var resGuardada = false;
      function guardarReserva(metodo) {
        if (!resGuardada) {
          C.crearReserva({ local: localBuf, barbero: barbBuf || null, servicio: servBuf, fecha: diaBuf, hora: horaBuf, nombre: 'Desde la web', tel: '', propio: true, metodoPago: metodo });
          resGuardada = true;
        }
      }
      window._pagarOnline = function(){ guardarReserva('online'); paso6(); };
      window._pagarEfectivo = function(){ guardarReserva('efectivo'); paso6(); };
      var html = headerReserva('Pago', true) +
        '<div class="paso-ind">' + [0,1,2,3,4].map(function(i){ return '<span class="paso-dot'+(i<=4?' act':'')+'"></span>'; }).join('') + '</div>' +
        '<div class="confirm-box">' +
          '<p><strong>Local</strong><br>' + esc(loc.nombre) + '</p>' +
          '<p style="margin-top:8px"><strong>Servicio</strong><br>' + esc(serv.nombre) + '</p>' +
          (barb ? '<p style="margin-top:8px"><strong>Barbero</strong><br>' + esc(barb.nombre) + '</p>' : '') +
          '<p style="margin-top:8px"><strong>Fecha y hora</strong><br>' + esc(C.fmtLarga(diaBuf)) + ' a las ' + esc(horaBuf) + '</p>' +
        '</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px">¿Cómo vas a pagar?</p>' +
        '<button class="pago-btn" onclick="window._pagarOnline&&window._pagarOnline()">' +
          '<span class="pago-ico">💳</span>' +
          '<span class="pago-info"><span class="pago-nombre">Tarjeta o transferencia</span><span class="pago-precio">' + C.clp(serv.precio) + '</span></span>' +
        '</button>' +
        '<button class="pago-btn" onclick="window._pagarEfectivo&&window._pagarEfectivo()" style="margin-top:10px">' +
          '<span class="pago-ico">💵</span>' +
          '<span class="pago-info"><span class="pago-nombre">Efectivo al llegar</span><span class="pago-precio pago-precio--ef">' + C.clp(serv.efectivo||serv.precio) + '</span></span>' +
        '</button>' +
        '<p class="pago-nota">Efectivo: precio con descuento · Demo: en producción se conecta a pasarela de pago.</p>';
      panel.innerHTML = html;
      window._hBack = paso4;
    }

    function paso6(){
      var html = headerReserva('Reservado', false) +
        '<div class="paso-ind">' + [0,1,2,3,4].map(function(){ return '<span class="paso-dot act"></span>'; }).join('') + '</div>' +
        '<div class="confirm-ok">' +
          '<div class="confirm-ok-icon">✓</div>' +
          '<h3>¡Hora reservada!</h3>' +
          '<p>Tu reserva está confirmada. Te esperamos el ' + esc(C.fmtLarga(diaBuf)) + ' a las ' + esc(horaBuf) + '.</p>' +
        '</div>' +
        '<button class="btn-ghost" style="width:100%;min-height:44px;margin-top:16px" onclick="window._hClose()">Cerrar</button>';
      panel.innerHTML = html;
      window._hBack = null;
    }

    if (barbBuf) { localBuf = (D.barberos.find(function(b){return b.id===barbBuf;})||{locales:['membrillar']}).locales[0]||'membrillar'; paso3(); }
  }

  /* Acción del panel recibe click de locales dinámicos */
  document.addEventListener('click', function(e){
    if (!e.target.closest('.hoja-panel')) return;
  });

})();
