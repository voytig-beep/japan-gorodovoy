const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.primary-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  });
});

const search = document.querySelector('#archive-search');
const rows = [...document.querySelectorAll('.archive-row')];
const chips = [...document.querySelectorAll('.chip')];
const empty = document.querySelector('#archive-empty');
let activeFilter = 'all';

function filterArchive() {
  const query = (search?.value || '').trim().toLocaleLowerCase('ru');
  let visible = 0;

  rows.forEach((row) => {
    const matchesFilter = activeFilter === 'all' || row.dataset.type === activeFilter;
    const haystack = `${row.dataset.search || ''} ${row.textContent}`.toLocaleLowerCase('ru');
    const matchesSearch = !query || haystack.includes(query);
    row.hidden = !(matchesFilter && matchesSearch);
    if (!row.hidden) visible += 1;
  });

  if (empty) empty.hidden = visible !== 0;
}

search?.addEventListener('input', filterArchive);
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    activeFilter = chip.dataset.filter;
    chips.forEach((item) => item.classList.toggle('active', item === chip));
    filterArchive();
  });
});

const ANALYTICS_CONSENT_KEY = 'jg_analytics_consent';
const METRIKA_ID = 114170464;

function readAnalyticsConsent() {
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  } catch {
    return null;
  }
}

function saveAnalyticsConsent(value) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // Сайт продолжает работать, даже если браузер запретил localStorage.
  }
}

function loadMetrika() {
  if (window.ym) return;

  window.ym = function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`;
  document.head.append(tag);

  window.ym(METRIKA_ID, 'init', {
    clickmap: true,
    accurateTrackBounce: true,
    trackLinks: true,
    webvisor: false,
  });
}

function showAnalyticsNotice() {
  if (document.querySelector('.analytics-notice')) return;

  const notice = document.createElement('aside');
  notice.className = 'analytics-notice';
  notice.setAttribute('aria-label', 'Настройка аналитики');
  notice.innerHTML = `
    <p>Разрешить обезличенно считать посещения? Запись экрана и форм отключена. <a href="privacy.html">Подробнее</a></p>
    <div>
      <button class="button button-primary" type="button" data-analytics="accept">Разрешить</button>
      <button class="button" type="button" data-analytics="decline">Только необходимые</button>
    </div>`;

  notice.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-analytics]')?.dataset.analytics;
    if (!choice) return;
    saveAnalyticsConsent(choice);
    if (choice === 'accept') loadMetrika();
    notice.remove();
  });

  document.body.append(notice);
}

const analyticsConsent = readAnalyticsConsent();
if (analyticsConsent === 'accept') {
  loadMetrika();
} else if (analyticsConsent !== 'decline') {
  showAnalyticsNotice();
}

