const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ic = n => `<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const pick = (btns, on) => btns.forEach(b => b.setAttribute('aria-pressed', b === on));

/* ---------- Tab navigation (uses the #hash in the address bar) ---------- */
const ids = $$('main > section').map(s => s.id);
function route() {
  let h = location.hash.slice(1);
  if (!ids.includes(h)) h = 'overview';
  ids.forEach(i => $('#' + i).hidden = i !== h);
  $$('#nav a').forEach(a => a.getAttribute('href') === '#' + h
    ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();

/* ---------- Causes: click a source to learn more ---------- */
const causes = [
  ['bolt', 'Fossil fuels', 'Burning coal, oil and gas for electricity, heat and vehicles is the largest source of greenhouse gases.', 'Switch off devices you are not using.'],
  ['tree', 'Deforestation', 'Forests store carbon. When they are cleared or burned, that carbon returns to the air and fewer trees remain to absorb more.', 'Choose recycled paper and certified wood.'],
  ['wheat', 'Farming', 'Livestock, rice fields and fertiliser release methane and nitrous oxide, which trap heat strongly.', 'Waste less food and try more plant-based meals.'],
  ['car', 'Transport', 'Cars, trucks, ships and planes mostly run on fossil fuels and add emissions with every trip.', 'Walk, cycle or share rides for short trips.'],
  ['factory', 'Industry', 'Making cement, steel and plastics needs lots of energy, and some processes release CO₂ directly.', 'Repair and reuse before buying new.']
];
const WM = 'https://commons.wikimedia.org/wiki/';
// Each picture has a drawn illustration (always works) with the real photo on top when it loads.
const art = [
  '<rect width="300" height="200" fill="#c9dce8"/><rect y="150" width="300" height="50" fill="#7d8f6a"/><rect x="60" y="100" width="150" height="55" fill="#6b6f73"/><rect x="85" y="40" width="26" height="62" fill="#8a8f94"/><rect x="150" y="55" width="26" height="47" fill="#8a8f94"/><g fill="#e8edf0"><circle cx="100" cy="30" r="16"/><circle cx="125" cy="22" r="14"/><circle cx="163" cy="42" r="14"/><circle cx="188" cy="34" r="12"/></g>',
  '<rect width="300" height="200" fill="#e8dcc0"/><circle cx="240" cy="40" r="22" fill="#f2b84b"/><rect y="140" width="300" height="60" fill="#8b6b4a"/><g fill="#a5815a"><rect x="30" y="125" width="26" height="22"/><rect x="90" y="132" width="22" height="18"/><rect x="150" y="124" width="28" height="24"/></g><g fill="#6b4a2e"><rect x="226" y="120" width="8" height="30"/><rect x="266" y="128" width="7" height="24"/></g><g fill="#5f8f4a"><circle cx="230" cy="105" r="30"/><circle cx="270" cy="115" r="24"/></g>',
  '<rect width="300" height="200" fill="#cfe6f2"/><rect y="130" width="300" height="70" fill="#8fbf6a"/><g fill="#fff" stroke="#bbb"><rect x="100" y="135" width="10" height="32"/><rect x="125" y="135" width="10" height="32"/><rect x="170" y="135" width="10" height="32"/><rect x="190" y="135" width="10" height="32"/><rect x="90" y="85" width="120" height="55" rx="18"/><rect x="195" y="75" width="40" height="34" rx="10"/></g><g fill="#2b2b2b"><rect x="205" y="70" width="8" height="12" rx="3"/><circle cx="120" cy="105" r="10"/><circle cx="165" cy="115" r="12"/><circle cx="224" cy="90" r="3"/></g>',
  '<rect width="300" height="200" fill="#d3dbe0"/><rect y="115" width="300" height="65" fill="#55595d"/><path d="M0 155H300" stroke="#fff" stroke-width="3" stroke-dasharray="14 12"/><rect x="40" y="122" width="80" height="26" rx="7" fill="#d9483b"/><rect x="58" y="106" width="44" height="20" rx="6" fill="#d9483b"/><rect x="170" y="122" width="80" height="26" rx="7" fill="#2f6fb3"/><rect x="188" y="106" width="44" height="20" rx="6" fill="#2f6fb3"/><g fill="#222"><circle cx="62" cy="150" r="9"/><circle cx="102" cy="150" r="9"/><circle cx="192" cy="150" r="9"/><circle cx="232" cy="150" r="9"/></g><g fill="#9aa0a4"><circle cx="26" cy="140" r="9"/><circle cx="12" cy="130" r="7"/><circle cx="156" cy="140" r="9"/><circle cx="142" cy="130" r="7"/></g>',
  '<rect width="300" height="200" fill="#e3d9c6"/><rect y="160" width="300" height="40" fill="#777"/><path d="M40 160V110L80 130V110L120 130V110L160 130V160Z" fill="#8c5a45"/><rect x="200" y="70" width="24" height="90" fill="#a0a0a0"/><rect x="238" y="90" width="20" height="70" fill="#a0a0a0"/><g fill="#9a9a9a"><circle cx="212" cy="55" r="14"/><circle cx="232" cy="42" r="16"/><circle cx="248" cy="72" r="12"/></g>',
  '<rect width="300" height="200" fill="#d7ebf3"/><rect y="150" width="300" height="50" fill="#8fbf6a"/><circle cx="245" cy="40" r="20" fill="#f6c342"/><g fill="none" stroke="#1f2a24" stroke-width="5"><circle cx="100" cy="135" r="30"/><circle cx="200" cy="135" r="30"/><path d="M100 135L140 90L180 90L200 135M140 90L155 135L100 135M180 90L170 68H152"/></g>',
  '<rect width="300" height="200" fill="#cfe6f6"/><circle cx="240" cy="45" r="24" fill="#f6c342"/><path d="M240 8v10M240 72v10M203 45h10M267 45h10" stroke="#f6c342" stroke-width="4"/><path d="M60 150L110 90H230L200 150Z" fill="#1f4e79"/><path d="M85 120H215M72 135H208M137 90L125 150M170 90L162 150" stroke="#9fc3e6" stroke-width="2"/><rect x="127" y="150" width="8" height="30" fill="#555"/>',
  '<rect width="300" height="200" fill="#d6e8f2"/><path d="M0 150L70 60L130 140L190 70L300 160V200H0Z" fill="#7aa5a0"/><rect y="160" width="300" height="40" fill="#4d8a4a"/><g fill="#2f6b3a"><path d="M40 165l16-50 16 50zM90 170l14-42 14 42zM210 165l18-55 18 55zM250 172l14-40 14 40z"/></g>'
];
const photos = [
  [
   "Power_plant_Burshtyn_TES,_Ukraine-6333a.jpg",
   "Coal-fired power stations burn coal to make electricity.",
   "Raimond Spekking, CC BY-SA 4.0"
  ],
  [
   "Fires_and_Deforestation_on_the_Amazon_Frontier,_Rondonia,_Brazil_-_September_30,_2007.jpg",
   "Cleared forest can no longer soak up carbon.",
   "NASA"
  ],
  [
   "Holstein_dairy_cows_at_the_Dunnum_Family_Farm.jpg",
   "Cows give off methane, a strong greenhouse gas.",
   "Carol M. Highsmith, Library of Congress"
  ],
  [
   "Auckland_traffic_-_copyright-free_photo_released_to_public_domain.jpg",
   "Most cars, trucks and planes still burn fossil fuels.",
   "Public domain"
  ],
  [
   "Air_pollution_by_industrial_chimneys.jpg",
   "Factories release gases from their chimneys.",
   "Wikimedia Commons"
  ],
  [
   "401_Gridlock.jpg",
   "Every bike ride is one less car on the road.",
   "Robert Jack, CC BY-SA 2.0"
  ],
  [
   "Solar_Panels_at_Topaz_Solar_5_(8159036498).jpg",
   "Solar panels make electricity without burning anything.",
   "Sarah Swenty / USFWS"
  ],
  [
   "Aerial_view_of_the_Amazon_Rainforest.jpg",
   "Forests soak up carbon and shelter wildlife.",
   "Wikimedia Commons"
  ]
];
const fig = i => {
  const p = photos[i];
  return `<figure class="polaroid"><div class="frame"><svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${art[i]}</svg><img src="${WM}Special:FilePath/${p[0]}?width=960" data-f="${p[0]}" alt="" loading="lazy"></div><figcaption>${p[1]}<small>Photo: <a href="${WM}File:${p[0]}" target="_blank" rel="noopener">${p[2]}</a></small></figcaption></figure>`;
};
document.addEventListener('load', e => { if (e.target.tagName === 'IMG') e.target.closest('figure').classList.add('ok'); }, true);
document.addEventListener('error', e => {
  const im = e.target;
  if (im.tagName !== 'IMG') return;
  if (!im.dataset.t) { im.dataset.t = 1; im.src = 'images/' + im.dataset.f; }  // second try: a copy saved in an images folder
  else im.remove();                                                            // otherwise the drawing stays
}, true);
$$('.slot').forEach(el => el.outerHTML = fig(el.dataset.p));
const chips = $('#chips');
chips.innerHTML = causes.map((c, i) => `<button class="chip" aria-pressed="false" data-i="${i}">${ic(c[0])} ${c[1]}</button>`).join('');
chips.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  pick($$('.chip', chips), b);
  const c = causes[b.dataset.i];
  $('#cd').innerHTML = fig(+b.dataset.i) + `<div><h3>${ic(c[0])} ${c[1]}</h3><p>${c[2]}</p><p><b>A small step:</b> ${c[3]}</p></div>`;
});
$('.chip', chips).click();

/* ---------- Effects: compare 1.5°C and 2°C ---------- */
const fx = {
  '1.5': { h: 55, rows: [['Coral reefs', '70–90% lost'], ['Arctic summers', 'Ice-free about once a century'], ['Severe heatwaves', 'About 14% of people hit at least once every 5 years']] },
  '2':   { h: 80, rows: [['Coral reefs', 'More than 99% lost'], ['Arctic summers', 'Ice-free at least once a decade'], ['Severe heatwaves', 'About 37% of people hit at least once every 5 years']] }
};
const icons = ['coral', 'ice', 'heat'];
const meaning = ['Fishing families and coastal towns rely on reefs for food and income.', 'Less sea ice means less shelter for polar wildlife.', 'Think of days too hot to work, study or play outside.'];
function showFx(k) {
  $('.fill').style.setProperty('--h', fx[k].h + '%');
  $('#tv').textContent = '+' + k + '°C';
  $('#stats').innerHTML = fx[k].rows.map((r, i) => `<div class="stat"><div><span>${ic(icons[i])}${r[0]}</span><b>${r[1]}</b></div><small>${meaning[i]}</small></div>`).join('');
}
$('#seg').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  pick($$('#seg button'), b);
  showFx(b.dataset.k);
});
setTimeout(() => showFx('1.5'), 150);

/* ---------- Solutions: filter cards by who acts ---------- */
$('#flt').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  pick($$('#flt button'), b);
  $$('#sol .card').forEach(c => c.hidden = b.dataset.f !== 'all' && c.dataset.who !== b.dataset.f);
});

/* ---------- Footprint calculator ---------- */
const tips = [
  'Your biggest slice is car travel. Try walking, cycling or sharing rides.',
  'Your biggest slice is meat. Swapping a few meals for plant-based ones adds up fast.',
  'Your biggest slice is flying. Choose trains or video calls where you can.',
  'Your biggest slice is electricity. Use LEDs, switch off standby and set air-con higher.'
];
function calc() {
  let total = 0, max = 0, top = 0;
  $$('#calc input').forEach((inp, n) => {
    $('output', inp.parentNode).textContent = inp.value;
    const kg = inp.value * inp.dataset.k;
    total += kg;
    if (kg > max) { max = kg; top = n; }
  });
  $('#tot').textContent = (total / 1000).toFixed(1);
  $('.bar i').style.width = Math.min(100, total / 100) + '%';
  $('#tip').textContent = tips[top];
}
$('#calc').addEventListener('input', calc);
calc();

/* ---------- Feedback form ---------- */
let list = [], rating = 0;
try { list = JSON.parse(localStorage.getItem('sdg13-feedback') || '[]'); } catch (e) {}
const stars = $('#stars'), er = $('#er');
stars.innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? 's' : ''}" data-n="${n}">★</button>`).join('');
stars.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  rating = +b.dataset.n;
  [...stars.children].forEach((s, i) => { s.classList.toggle('on', i < rating); s.setAttribute('aria-checked', i + 1 === rating); });
});
$('#ms').addEventListener('input', e => $('#cnt').textContent = e.target.value.length + ' / 300');

function render() {
  const box = $('#fl');
  box.textContent = '';
  if (!list.length) { box.innerHTML = '<p class="note">No feedback yet.</p>'; return; }
  list.forEach(x => {
    const d = document.createElement('div'), h = document.createElement('b'), p = document.createElement('p');
    d.className = 'item';
    h.textContent = `${x.name}: ${'★'.repeat(x.rating)}${'☆'.repeat(5 - x.rating)} (${x.section})`;
    p.textContent = x.msg;
    d.append(h, p);
    box.append(d);
  });
}
$('#fb').addEventListener('submit', e => {
  e.preventDefault();
  er.className = '';
  const name = $('#nm').value.trim(), msg = $('#ms').value.trim();
  if (!name) return er.textContent = 'Enter your name so we know who to thank.';
  if ($('#em').value && !$('#em').checkValidity()) return er.textContent = 'That email looks incomplete. Fix it or leave it blank.';
  if (!rating) return er.textContent = 'Pick a star rating from 1 to 5.';
  if (msg.length < 10) return er.textContent = 'Write at least 10 characters in your message.';
  list.unshift({ name, rating, section: $('#fv').value, msg });
  list = list.slice(0, 20);
  try { localStorage.setItem('sdg13-feedback', JSON.stringify(list)); } catch (x) {}
  e.target.reset();
  rating = 0;
  [...stars.children].forEach(s => s.classList.remove('on'));
  $('#cnt').textContent = '0 / 300';
  er.className = 'ok';
  er.textContent = 'Thank you, ' + name + '! Your feedback was saved.';
  render();
});
render();

/* ---------- Human touches: greeting, name memory and pledges ---------- */
var who = '';

$('#sol').addEventListener('click', e => {
  const b = e.target.closest('.pledge');
  if (!b) return;
  b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
  const n = $$('.pledge[aria-pressed="true"]').length;
  $('#pl').textContent = n ? `That’s ${n} ${n > 1 ? 'promises' : 'promise'}. Tell one person about it today.` : 'Pick one small thing that fits your life.';
});

/* ---------- Warming stripes (decorative) and facts ---------- */
$('#stripes').innerHTML = Array.from({ length: 72 }, (_, i) => {
  const t = Math.min(1, Math.max(0, i / 71 + (Math.random() - .5) * .2)), u = Math.abs(2 * t - 1);
  return `<i style="background:hsl(${t < .5 ? 214 : 4},${60 + 12 * u}%,${90 - 52 * u}%)"></i>`;
}).join('');
const facts = [
  'Mitigation means cutting the greenhouse gases that cause warming. Adaptation means preparing for changes already on the way. We need both.',
  'Carbon dioxide can stay in the atmosphere for hundreds of years, so every year we act earlier helps.',
  'Almost every country has joined the Paris Agreement, which was adopted in 2015.',
  'Forests, soils and oceans absorb a large share of the carbon dioxide we release.',
  'Small habits add up. Millions of people changing how they travel or eat can shift whole markets.'
];
let fi = 0;
$('#fact').textContent = facts[0];
$('#nf').addEventListener('click', () => { fi = (fi + 1) % facts.length; $('#fact').textContent = facts[fi]; });
