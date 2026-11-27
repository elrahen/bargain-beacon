// Rendering for Price Patrol: deal cards, the detail panel and the
// summary bar. This file only turns deal objects into HTML strings; all
// filtering and sorting state lives in main.js.

import { CATEGORIES, VERDICTS } from './data.js';

export function money(value) {
  return '$' + value.toFixed(2).replace(/\.00$/, '');
}

export function discountPct(deal) {
  if (!deal.usual || deal.usual <= deal.price) return 0;
  return Math.round((1 - deal.price / deal.usual) * 100);
}

export function saveAmount(deal) {
  return Math.max(0, deal.usual - deal.price);
}

function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

export function verdictBadge(deal) {
  const v = VERDICTS[deal.verdict];
  return `<span class="verdict verdict-${v.tone}">${v.label}</span>`;
}

export function cardHtml(deal) {
  const pct = discountPct(deal);
  return `<article class="card" data-deal="${deal.id}" tabindex="0" role="button" aria-label="Show details for ${deal.name}">
    <div class="card-top">
      <span class="store">${deal.store}</span>
      <span class="cat">${categoryLabel(deal.category)}</span>
    </div>
    <h3>${deal.name}</h3>
    <p class="detail">${deal.detail}</p>
    <div class="prices">
      <span class="sale">${money(deal.price)}</span>
      <span class="usual">${money(deal.usual)}</span>
      <span class="pct">-${pct}%</span>
    </div>
    <p class="save">You save ${money(saveAmount(deal))}</p>
    <div class="verdict-row">${verdictBadge(deal)}</div>
    <p class="evidence">${deal.evidence}</p>
    <div class="card-foot">
      <a class="store-link" href="${deal.url}" target="_blank" rel="noopener noreferrer">View at ${deal.store} &rarr;</a>
      <span class="checked">Checked ${deal.checked}</span>
    </div>
  </article>`;
}

export function gridHtml(deals) {
  if (deals.length === 0) {
    return `<p class="empty">No deals match those filters. Try clearing the search or widening the discount filter.</p>`;
  }
  return deals.map(cardHtml).join('\n');
}

export function detailHtml(deal) {
  if (!deal) return '';
  const pct = discountPct(deal);
  return `<section class="detail-panel" aria-live="polite">
    <div class="detail-head">
      <h2>${deal.name}</h2>
      <button type="button" class="close-detail" aria-label="Close details">&times;</button>
    </div>
    <p class="detail-sub">${deal.detail} &middot; ${categoryLabel(deal.category)} &middot; ${deal.store}</p>
    <div class="detail-prices">
      <div><span class="lbl">Sale price</span><span class="val sale">${money(deal.price)}</span></div>
      <div><span class="lbl">Usual price</span><span class="val">${money(deal.usual)}</span></div>
      <div><span class="lbl">You save</span><span class="val">${money(saveAmount(deal))} (${pct}%)</span></div>
    </div>
    <p><strong>Verdict: ${VERDICTS[deal.verdict].label}.</strong> ${deal.evidence}</p>
    ${deal.note ? `<p class="note">${deal.note}</p>` : ''}
    <p class="source"><strong>Where this was checked:</strong> ${deal.source}. Checked ${deal.checked}.</p>
    <p><a class="store-link big" href="${deal.url}" target="_blank" rel="noopener noreferrer">View at ${deal.store} &rarr;</a></p>
  </section>`;
}

export function summaryHtml(deals) {
  const totalSaved = deals.reduce((sum, d) => sum + saveAmount(d), 0);
  const best = deals.reduce((a, b) => (discountPct(b) > discountPct(a) ? b : a), deals[0]);
  const stores = new Set(deals.map((d) => d.store)).size;
  return `<div class="stat"><span class="num">${deals.length}</span><span class="cap">deals checked</span></div>
    <div class="stat"><span class="num">${stores}</span><span class="cap">stores</span></div>
    <div class="stat"><span class="num">-${discountPct(best)}%</span><span class="cap">biggest cut</span></div>
    <div class="stat"><span class="num">${money(totalSaved)}</span><span class="cap">total saved vs usual</span></div>`;
}
