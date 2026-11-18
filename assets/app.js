(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('y').textContent = new Date().getFullYear();

  /* ---- aparición al hacer scroll ---- */
  var els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---- odontograma FDI decorativo ---- */
  var UP = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
  var LO = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
  var STATE = { 36: 'r', 46: 'b', 26: 'b', 18: 'x', 38: 'x' };
  function row(nums, label) {
    var d = document.createElement('div'); d.className = 'row';
    nums.forEach(function (n) {
      var t = document.createElement('span'); t.className = 't' + (STATE[n] ? ' ' + STATE[n] : '');
      if (label && (n === 11 || n === 21 || n === 36 || n === 46)) { var e = document.createElement('em'); e.textContent = n; t.appendChild(e); }
      d.appendChild(t);
    });
    return d;
  }
  document.querySelectorAll('.odo').forEach(function (o) {
    var label = o.getAttribute('data-odo') === 'vec';
    o.appendChild(row(UP, label)); o.appendChild(row(LO, label));
  });

  /* ---- pestañas accesibles (flechas, Inicio, Fin) ---- */
  function tabs(list, onUser) {
    var btns = Array.prototype.slice.call(list.querySelectorAll('[role=tab]'));
    function select(i, focus) {
      btns.forEach(function (b, j) {
        var on = i === j;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        var p = document.getElementById(b.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) btns[i].focus();
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i, false); if (onUser) onUser(); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % btns.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + btns.length) % btns.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = btns.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); if (onUser) onUser(); }
      });
    });
    select(0, false);
    return { select: select, count: btns.length, current: function () { return btns.findIndex(function (b) { return b.getAttribute('aria-selected') === 'true'; }); } };
  }

  /* demo del hero: alterna solo cada 6 s hasta que la persona interactúa */
  var demo = document.querySelector('[data-demo]');
  if (demo) {
    var stopped = reduce, hovering = false;
    var dt = tabs(demo.querySelector('[role=tablist]'), function () { stopped = true; });
    demo.addEventListener('mouseenter', function () { hovering = true; });
    demo.addEventListener('mouseleave', function () { hovering = false; });
    demo.addEventListener('focusin', function () { stopped = true; });
    if (!stopped) {
      setInterval(function () {
        if (stopped || hovering || document.hidden) return;
        dt.select((dt.current() + 1) % dt.count, false);
      }, 6000);
    }
  }

  /* módulos del producto */
  var pt = document.querySelector('.ptabs');
  if (pt) tabs(pt);

  /* ---- formulario del piloto ---- */
  var form = document.getElementById('pilot-form');
  if (!form) return;
  var done = document.getElementById('form-done');
  var cfg = { endpoint: form.dataset.endpoint || '', whatsapp: (form.dataset.whatsapp || '').replace(/\D/g, ''), email: form.dataset.email || '' };
  var altWa = document.getElementById('alt-wa'), altSep = document.getElementById('alt-sep');
  function waLink(text) { return 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(text); }
  if (cfg.whatsapp) {
    altWa.href = waLink('Hola, quiero información sobre el piloto de Dental Nubix.');
    altWa.hidden = false; altSep.hidden = false;
  }

  var rules = {
    nombre: function (v) { return v.trim().length >= 3 ? '' : 'Escribe tu nombre y apellido.'; },
    clinica: function (v) { return v.trim().length >= 2 ? '' : 'Escribe el nombre de tu clínica o consultorio.'; },
    especialidad: function (v) { return v ? '' : 'Elige una especialidad.'; },
    ciudad: function (v) { return v.trim().length >= 2 ? '' : 'Escribe tu ciudad.'; },
    telefono: function (v) { return v.replace(/\D/g, '').length >= 10 ? '' : 'Escribe un teléfono de 10 dígitos.'; }
  };
  var ids = { nombre: 'nombre', clinica: 'clinica', especialidad: 'esp', ciudad: 'ciudad', telefono: 'tel' };

  function validate() {
    var first = null, ok = true;
    Object.keys(rules).forEach(function (k) {
      var inp = document.getElementById('f-' + ids[k]), err = document.getElementById('e-' + ids[k]);
      var msg = rules[k](inp.value);
      err.textContent = msg;
      if (msg) { inp.setAttribute('aria-invalid', 'true'); ok = false; if (!first) first = inp; }
      else inp.removeAttribute('aria-invalid');
    });
    if (first) first.focus();
    return ok;
  }
  form.addEventListener('input', function (e) {
    var t = e.target; if (t.getAttribute('aria-invalid')) { t.removeAttribute('aria-invalid'); var er = document.getElementById(t.getAttribute('aria-describedby')); if (er) er.textContent = ''; }
  });

  function message(d) {
    return 'Solicitud de piloto · Dental Nubix\n' +
      'Nombre: ' + d.nombre + '\nClínica: ' + d.clinica + '\nEspecialidad: ' + d.especialidad +
      '\nCiudad: ' + d.ciudad + '\nWhatsApp/teléfono: ' + d.telefono;
  }
  function showDone(d, sent) {
    var text = message(d);
    form.hidden = true; done.hidden = false;
    document.getElementById('done-msg').textContent = sent
      ? 'Recibimos tu solicitud. Te contactaremos para platicar el piloto.'
      : 'Aún no se ha enviado: elige cómo mandarla con un toque. Así llega completa y te respondemos más rápido.';
    var wa = document.getElementById('done-wa'), mail = document.getElementById('done-mail'), copy = document.getElementById('done-copy');
    if (sent) { wa.hidden = true; mail.hidden = true; copy.hidden = true; }
    else {
      if (cfg.whatsapp) { wa.href = waLink(text); wa.hidden = false; }
      mail.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('Solicitud de piloto Dental Nubix') + '&body=' + encodeURIComponent(text);
      copy.onclick = function () {
        var ok = document.getElementById('copy-ok');
        function good() { ok.textContent = 'Datos copiados. Pégalos en tu mensaje.'; }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(good, function () { ok.textContent = 'No pudimos copiar; selecciona y copia el texto de tu solicitud.'; });
        else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); good(); } catch (x) {} document.body.removeChild(ta); }
      };
    }
    done.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements.web && form.elements.web.value) return; /* trampa para bots */
    if (!validate()) return;
    var d = {};
    ['nombre', 'clinica', 'especialidad', 'ciudad', 'telefono'].forEach(function (k) { d[k] = form.elements[k].value.trim(); });
    if (cfg.endpoint) {
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Enviando…';
      fetch(cfg.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); showDone(d, true); })
        .catch(function () { btn.disabled = false; btn.textContent = 'Solicitar mi lugar en el piloto →'; showDone(d, false); });
    } else showDone(d, false);
  });
})();
