// scripts.js - comportamento: header fixo + menu toggle + form + year + CTA scroll
document.addEventListener('DOMContentLoaded', function() {
  // --- YEAR ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- FORM (mantém seu comportamento) ---
  var form = document.querySelector('#contato form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Aqui você pode integrar com EmailJS, Formspree, Netlify Forms ou seu back-end
      alert('Obrigado! Recebemos sua mensagem — entraremos em contato em até 48h.');
      form.reset();
    });
  }

  // --- CTA: rolar para contato ---
  var cta = document.getElementById('cta-orcamento');
  if (cta) {
    cta.addEventListener('click', function() {
      var contato = document.getElementById('contato');
      if (contato) contato.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- HEADER FIXO & COMPORTAMENTO AO ROLAR ---
  (function() {
    var header = document.getElementById('siteHeader');
    var navToggle = document.getElementById('navToggle');
    var menu = document.getElementById('menu');

    if (!header) return; // se não existir, sai

    var lastScroll = window.pageYOffset || document.documentElement.scrollTop;
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var current = window.pageYOffset || document.documentElement.scrollTop;

          // adicionar classe 'scrolled' depois de um pequeno deslocamento
          if (current > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }

          // esconder ao rolar pra baixo, mostrar ao rolar pra cima
          if (current > lastScroll && current > 80) {
            header.classList.add('hidden');
          } else {
            header.classList.remove('hidden');
          }

          lastScroll = current <= 0 ? 0 : current;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // --- NAV TOGGLE (mobile) ---
    if (navToggle && menu) {
      navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = menu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        // opcional: bloquear scroll do body quando o menu mobile está aberto
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });

      // fechar menu ao clicar fora
      document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !navToggle.contains(e.target)) {
          if (menu.classList.contains('open')) {
            menu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }
        }
      });

      // fechar ao clicar em um link do menu (útil no mobile)
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

  // --- Acessibilidade: permitir Enter/Space para "clicar" cards (opcional) ---
  document.querySelectorAll('.card, .value').forEach(function(el) {
    el.setAttribute('tabindex', el.getAttribute('tabindex') || '0'); // garante foco
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click && el.click();
      }
    });
  });

});
