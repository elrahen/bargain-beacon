// State and controls for Price Patrol: search text, category chips,
// store and discount filters, sorting, and the detail panel. Data comes
// from data.js; HTML comes from views.js. Nothing here fetches anything
// over the network.

import { CATEGORIES, DEALS } from './data.js';
import { cardHtml, detailHtml, discountPct, gridHtml, summaryHtml } from './views.js';

const grid = document.getElementById('grid');
const detailSlot = document.getElementById('detail-slot');
const summary = document.getElementById('summary');
const searchInput = document.getElementById('search');
const storeSelect = document.getElementById('store-filter');
const discountSelect = document.getElementById('discount-filter');
const sortSelect = document.getElementById('sort');
const chipRow = document.getElementById('chips');
const countLine = document.getElementById('count-line');

const state = {
  query: '',
  category: 'all',
  store: 'all',
  minDiscount: 0,
  sort: 'discount',
  openDeal: null,
};

function storesInUse() {
  return [...new Set(DEALS.map((d) => d.store))].sort();
}

function buildChips() {
  const chips = [{ id: 'all', label: 'All categories' }, ...CATEGORIES];
  chipRow.innerHTML = chips
    .map(
      (c) =>
        `<button type="button" class="chip${state.category === c.id ? ' active' : ''}" data-cat="${c.id}" aria-pressed="${state.category === c.id}">${c.label}</button>`,
    )
    .join('');
}

function buildStoreOptions() {
  const current = storeSelect.value || 'all';
  storeSelect.innerHTML =
    '<option value="all">All stores</option>' +
    storesInUse().map((s) => `<option value="${s}">${s}</option>`).join('');
  storeSelect.value = storesInUse().includes(current) ? current : 'all';
}

function applyFilters() {
  const q = state.query.trim().toLowerCase();
  return DEALS.filter((deal) => {
    if (state.category !== 'all' && deal.category !== state.category) return false;
    if (state.store !== 'all' && deal.store !== state.store) return false;
    if (discountPct(deal) < state.minDiscount) return false;
    if (q) {
      const hay = `${deal.name} ${deal.detail} ${deal.store} ${deal.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function applySort(list) {
  const rank = { newlow: 0, strong: 1, fair: 2 };
  const sorted = [...list];
  if (state.sort === 'discount') sorted.sort((a, b) => discountPct(b) - discountPct(a) || a.price - b.price);
  if (state.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  if (state.sort === 'verdict') sorted.sort((a, b) => rank[a.verdict] - rank[b.verdict] || discountPct(b) - discountPct(a));
  return sorted;
}

function render() {
  const filtered = applySort(applyFilters());
  grid.innerHTML = gridHtml(filtered);
  summary.innerHTML = summaryHtml(DEALS);
  countLine.textContent = `Showing ${filtered.length} of ${DEALS.length} deals`;
  if (state.openDeal) {
    const deal = DEALS.find((d) => d.id === state.openDeal);
    detailSlot.innerHTML = deal ? detailHtml(deal) : '';
  } else {
    detailSlot.innerHTML = '';
  }
}

function openDetail(id) {
  state.openDeal = id;
  render();
  const panel = detailSlot.querySelector('.detail-panel');
  if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeDetail() {
  state.openDeal = null;
  render();
}

grid.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link) return; // let the store link open normally
  const card = event.target.closest('.card');
  if (card) openDetail(card.dataset.deal);
});

grid.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('.card');
  if (card) {
    event.preventDefault();
    openDetail(card.dataset.deal);
  }
});

detailSlot.addEventListener('click', (event) => {
  if (event.target.closest('.close-detail')) closeDetail();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.openDeal) closeDetail();
});

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  render();
});

chipRow.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  state.category = chip.dataset.cat;
  buildChips();
  render();
});

storeSelect.addEventListener('change', () => {
  state.store = storeSelect.value;
  render();
});

discountSelect.addEventListener('change', () => {
  state.minDiscount = Number(discountSelect.value);
  render();
});

sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  render();
});

buildChips();
buildStoreOptions();
render();
