// scripts.js - comportamento: header fixo + menu toggle + form + year + CTA scroll
document.addEventListener('DOMContentLoaded', function() {
  // YEAR
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // FORM
  var form = document.querySelector('#contato form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Integre com EmailJS/Formspree/Back-end conforme desejar
      alert('Obrigado! Recebemos sua mensagem — entraremos em contato em até 48h.');
      form.reset();
    });
  }

  // HEADER & NAV TOGGLE
  (function() {
    var header = document.getElementById('siteHeader');
    var navToggle = document.getElementById('navToggle');
    var menu = document.getElementById('menu');

    if (!header) return;

    var lastScroll = window.pageYOffset || document.documentElement.scrollTop;
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var current = window.pageYOffset || document.documentElement.scrollTop;

          if (current > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');

          if (current > lastScroll && current > 80) header.classList.add('hidden'); else header.classList.remove('hidden');

          lastScroll = current <= 0 ? 0 : current;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // nav toggle (mobile)
    if (navToggle && menu) {
      navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = menu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = '';
      });

      // fechar ao clicar fora
      document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !navToggle.contains(e.target)) {
          if (menu.classList.contains('open')) {
            menu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
        }
      });

      // fechar ao clicar em link (útil no mobile)
      Array.from(menu.querySelectorAll('a')).forEach(function(a) {
        a.addEventListener('click', function() {
          if (menu.classList.contains('open')) {
            menu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
        });
      });
    }
  })();

  // permitir Enter/Space para "clicar" cards (acessibilidade)
  document.querySelectorAll('.card, .value').forEach(function(el) {
    el.setAttribute('tabindex', el.getAttribute('tabindex') || '0');
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click && el.click();
      }
    });
  });

});

// -------------------------
// Project modal using <template> in HTML
// -------------------------
(function() {
  var modal = document.getElementById('projectModal');
  if (!modal) return;
  var overlay = modal.querySelector('.project-modal__overlay');
  var closeBtn = document.getElementById('projectModalClose');
  var titleEl = document.getElementById('projectModalTitle');
  var subtitleEl = document.getElementById('projectModalSubtitle');
  var galleryEl = document.getElementById('projectModalGallery');
  var descEl = document.getElementById('projectModalDescription');
  var metaEl = document.getElementById('projectModalMeta');
  var ctaEl = document.getElementById('projectModalCTA');

  var lastFocused = null;

  function openModalFromTemplate(projectId) {
    var tmpl = document.getElementById('tmpl-' + projectId);
    // fallback: se não existir template, tenta ler data-* direto do card
    var card = document.querySelector('.card[data-project-id="'+projectId+'"]');

    if (tmpl) {
      // clona o conteúdo do template (não remove do template original)
      var clone = tmpl.content.cloneNode(true);

      var t = clone.querySelector('.proj-title');
      var s = clone.querySelector('.proj-subtitle');
      var g = clone.querySelectorAll('.proj-gallery img');
      var d = clone.querySelector('.proj-description');
      var m = clone.querySelector('.proj-meta');
      var c = clone.querySelector('.proj-cta');

      titleEl.textContent = t ? t.textContent : '';
      subtitleEl.textContent = s ? s.textContent : '';
      descEl.innerHTML = d ? d.innerHTML : '';
      metaEl.innerHTML = m ? m.innerHTML : '';
      ctaEl.href = c ? (c.href || '#') : '#';

      // povoar galeria (clonando imagens)
      galleryEl.innerHTML = '';
      if (g && g.length) {
        Array.prototype.forEach.call(g, function(img){
          var im = img.cloneNode(true);
          im.loading = 'lazy';
          // manter height dinâmico via CSS
          galleryEl.appendChild(im);
        });
      }
    } else if (card) {
      // fallback simples via data-* attributes (se você tiver colocado)
      titleEl.textContent = card.dataset.title || card.querySelector('h3')?.textContent || '';
      subtitleEl.textContent = card.dataset.subtitle || '';
      descEl.innerHTML = card.dataset.description || '';
      metaEl.innerHTML = card.dataset.meta || '';
      ctaEl.href = card.dataset.cta || '#';

      galleryEl.innerHTML = '';
      if (card.dataset.images) {
        card.dataset.images.split(',').forEach(function(src){
          var im = document.createElement('img');
          im.src = src.trim();
          im.alt = titleEl.textContent + ' — imagem';
          im.loading = 'lazy';
          galleryEl.appendChild(im);
        });
      }
    } else {
      // sem dados — aborta
      return;
    }

    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(function(){ closeBtn && closeBtn.focus(); }, 50);
    document.addEventListener('keydown', handleKeyDown);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); closeModal(); return; }
    if (e.key === 'Tab') {
      var focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
      focusable = Array.prototype.slice.call(focusable).filter(function(el){ return el.offsetParent !== null; });
      if (focusable.length === 0) { e.preventDefault(); return; }
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  }

  // evento de clique nas cards
  document.querySelectorAll('.card[data-project-id]').forEach(function(card){
    card.addEventListener('click', function(){
      var id = card.getAttribute('data-project-id');
      openModalFromTemplate(id);
    });
    // teclado (Enter/Space) já chama .click() graças ao seu código anterior
  });

  // overlay e botão de fechar
  overlay && overlay.addEventListener('click', function(e){
    if (e.target === overlay || overlay.contains(e.target)) closeModal();
  });
  closeBtn && closeBtn.addEventListener('click', closeModal);
})();

