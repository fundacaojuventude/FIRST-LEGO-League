const menuButton = document.querySelector('.menu');
const menu = document.getElementById('menu');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('open', open);
}
menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    setMenu(false);
    menuButton.focus();
  }
});

const views = {
  field: ['field.webp', 'Campo completo da Future Edition, com os modelos montados no tapete.', 'Campo de jogo da Future Edition'],
  tree: ['tree.webp', 'Modelo da árvore visto de perto, da base até à copa.', 'Árvore do campo BIOGLOW · Future Edition']
};
const model = document.querySelector('#object');
const viewButtons = document.querySelectorAll('[data-view]');
for (const button of viewButtons) {
  button.addEventListener('click', () => {
    const [file, alt, caption] = views[button.dataset.view];
    model.src = '' + file;
    model.alt = alt;
    document.querySelector('#object-text').textContent = caption;
    for (const option of viewButtons) option.setAttribute('aria-pressed', String(option === button));
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      model.animate([{opacity: 0.65, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 200});
    }
  });
}
const teams = document.querySelector('#teams');
if (teams) {
  const euro = new Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR'});
  teams.addEventListener('input', () => {
    const n = teams.valueAsNumber;
    const valid = teams.validity.valid && Number.isSafeInteger(n) && n >= 1;
    const rates = [200, 180, 165];
    const total = valid ? rates.slice(0, n).reduce((a, b) => a + b, 0) + Math.max(n - 3, 0) * 150 : 0;
    document.querySelector('#early').textContent = valid ? euro.format(total) : '—';
    document.querySelector('#late').textContent = valid ? euro.format(total * 1.1) : '—';
  });
}
