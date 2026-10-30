const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
function closeMenu() {
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Открыть меню');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
document.addEventListener('click', event => { if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu(); });

// Analytics consent. Set the real counter ID only after the public domain is ready.
const METRIKA_COUNTER_ID = null;
const cookieNotice = document.querySelector('.cookie-notice');
const cookieSettings = document.querySelector('[data-cookie-settings]');
if (cookieNotice && cookieSettings) {
  // A new counter requires a new choice; prior preview preferences cannot enable it.
  const counterId = Number.isSafeInteger(METRIKA_COUNTER_ID) && METRIKA_COUNTER_ID > 0 ? METRIKA_COUNTER_ID : null;
  const cookieName = 'vm_analytics_v1_' + (counterId || 'preview');
  const readChoice = () => {
    try {
      const entry = document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith(cookieName + '='));
      const value = entry ? entry.slice(cookieName.length + 1) : null;
      return ['accepted', 'rejected'].includes(value) ? value : null;
    } catch (_) { return null; }
  };
  const writeChoice = value => {
    try { document.cookie = cookieName + '=' + value + '; Max-Age=15552000; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch (_) {}
  };
  // Remove obsolete dismissal cookies; neither one granted analytics permission.
  for (const name of ['vm_cookie_notice', 'vm_cookie_preference']) {
    try { document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax'; } catch (_) {}
  }
  let choice = readChoice();
  let analyticsScript = null;
  let returnFocus = null;
  const startAnalytics = () => {
    if (choice !== 'accepted' || !counterId || analyticsScript) return;
    analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = 'https://mc.yandex.ru/metrika/tag.js';
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    analyticsScript.onload = () => {
      if (choice === 'accepted') window.ym(counterId, 'init', {webvisor:false, clickmap:false, trackLinks:true, accurateTrackBounce:true});
    };
    document.head.appendChild(analyticsScript);
  };
  cookieNotice.hidden = choice !== null;
  startAnalytics();
  cookieSettings.addEventListener('click', () => {
    returnFocus = cookieSettings;
    cookieNotice.hidden = false;
    cookieNotice.querySelector('[data-cookie-choice]').focus();
  });
  cookieNotice.querySelectorAll('[data-cookie-choice]').forEach(button => {
    button.addEventListener('click', () => {
      choice = button.dataset.cookieChoice === 'accept' ? 'accepted' : 'rejected';
      writeChoice(choice);
      cookieNotice.hidden = true;
      (returnFocus || cookieSettings).focus({preventScroll:true});
      returnFocus = null;
      if (choice === 'accepted') startAnalytics();
      else if (analyticsScript) {
        // Reload without loading the tag to stop all callbacks from the previous session.
        if (typeof window.ym === 'function') window.ym(counterId, 'destruct');
        analyticsScript.remove();
        if (readChoice() === 'rejected') window.location.reload();
      }
    });
  });
}

// Progressive enhancement: answers remain visible when JavaScript is unavailable.
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  const panel = document.getElementById(trigger.getAttribute('aria-controls'));
  const article = trigger.closest('.faq-answer');
  const setOpen = open => {
    trigger.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    article.classList.toggle('is-open', open);
  };
  setOpen(false);
  article.classList.add('faq-ready');
  trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
});

