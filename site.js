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
const ageGroup = document.querySelector('#age-group');
if (teams && ageGroup) {
  const euro = new Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR'});
  const rates = {
    younger: {standard:[265,240,220], special:[220,200,185], standardNext:205, specialNext:170},
    older: {standard:[365,340,325], special:[305,285,270], standardNext:305, specialNext:255}
  };
  function totalFor(count, firstRates, nextRate) {
    return firstRates.slice(0, count).reduce((sum, rate) => sum + rate, 0) + Math.max(count - 3, 0) * nextRate;
  }
  function updateCosts() {
    const selected = rates[ageGroup.querySelector('input:checked').value];
    const standard = [...selected.standard, selected.standardNext];
    const special = [...selected.special, selected.specialNext];
    document.querySelectorAll('#fee-rows tr').forEach((row, index) => {
      row.cells[1].textContent = euro.format(standard[index]);
      row.cells[2].textContent = euro.format(special[index]);
      row.cells[3].textContent = euro.format(special[index] * 1.1);
    });
    const count = teams.valueAsNumber;
    const valid = teams.validity.valid && Number.isSafeInteger(count) && count >= 1;
    const specialTotal = valid ? totalFor(count, selected.special, selected.specialNext) : 0;
    document.querySelector('#standard-total').textContent = valid ? euro.format(totalFor(count, selected.standard, selected.standardNext)) : '—';
    document.querySelector('#early').textContent = valid ? euro.format(specialTotal) : '—';
    document.querySelector('#late').textContent = valid ? euro.format(specialTotal * 1.1) : '—';
  }
  teams.addEventListener('input', updateCosts);
  ageGroup.addEventListener('change', updateCosts);
  updateCosts();
}
