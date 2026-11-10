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

