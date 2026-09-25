// Dashboard: loads data/monthly_stock_data.csv once, then does every filter,
// aggregation, and chart redraw in the browser from the in-memory row array.

const EXCHANGE_NAMES = { A: 'NYSE American', N: 'NYSE', P: 'NYSE Arca', Q: 'Nasdaq', Z: 'Cboe BZX' };
const ASSET_NAMES = { N: 'Stock', Y: 'ETF' };

let ROWS = [];
let charts = {};
let sortState = { key: 'ret', dir: 'desc' };

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

async function loadData() {
  const res = await fetch('data/monthly_stock_data.csv');
  const text = await res.text();
  const lines = text.split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const f = line.split(',');
    rows.push({
      sym: f[0], exch: f[1], mcat: f[2], etf: f[3], year: f[4], ym: f[5],
      open: +f[6], high: +f[7], low: +f[8], close: +f[9], adjClose: +f[10],
      volume: +f[11], days: +f[12], ret: +f[13],
    });
  }
  return rows;
}

function populateFilterOptions(rows) {
  const years = [...new Set(rows.map((r) => r.year))].sort();
  const yearSel = document.getElementById('filterYear');
  years.forEach((y) => yearSel.add(new Option(y, y)));

  const exchanges = [...new Set(rows.map((r) => r.exch))].sort();
  const exchSel = document.getElementById('filterExchange');
  exchanges.forEach((e) => exchSel.add(new Option(EXCHANGE_NAMES[e] || e, e)));
}

function getFilters() {
  return {
    year: document.getElementById('filterYear').value,
    ticker: document.getElementById('filterTicker').value.trim().toUpperCase(),
    exch: document.getElementById('filterExchange').value,
    asset: document.getElementById('filterAssetType').value,
  };
}

function filteredRows() {
  const f = getFilters();
  return ROWS.filter((r) =>
    (!f.year || r.year === f.year) &&
    (!f.ticker || r.sym.includes(f.ticker)) &&
    (!f.exch || r.exch === f.exch) &&
    (!f.asset || r.etf === f.asset));
}

function mean(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function median(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function groupKey(row, breakdown) {
  if (breakdown === 'year') return row.year;
  if (breakdown === 'exch') return EXCHANGE_NAMES[row.exch] || row.exch;
  if (breakdown === 'asset') return ASSET_NAMES[row.etf] || row.etf;
  return 'All';
}

function measureFor(rows, measure) {
  if (measure === 'avgReturn') return mean(rows.map((r) => r.ret));
  if (measure === 'medianReturn') return median(rows.map((r) => r.ret));
  if (measure === 'totalVolume') return rows.reduce((a, r) => a + r.volume, 0);
  if (measure === 'count') return rows.length;
  return 0;
}

function measureLabel(measure) {
  return { avgReturn: 'Average return', medianReturn: 'Median return', totalVolume: 'Total volume', count: 'Ticker-months' }[measure];
}

function isPctMeasure(measure) { return measure === 'avgReturn' || measure === 'medianReturn'; }

// ---------- Summary tiles ----------

function renderSummary(rows) {
  const tickers = new Set(rows.map((r) => r.sym)).size;
  const avgRet = mean(rows.map((r) => r.ret));
  const totalVol = rows.reduce((a, r) => a + r.volume, 0);

  document.getElementById('sumRows').textContent = fmtNumber(rows.length);
  document.getElementById('sumTickers').textContent = fmtNumber(tickers);
  const retEl = document.getElementById('sumReturn');
  retEl.textContent = rows.length ? fmtPct(avgRet) : '—';
  retEl.className = 'value ' + (avgRet >= 0 ? 'good' : 'bad');
  document.getElementById('sumVolume').textContent = rows.length ? fmtCompact(totalVol) : '—';
}

// ---------- Chart 1: breakdown (measure + breakdown switches) ----------

function renderBreakdownChart(rows) {
  const c = getColors();
  const measure = document.getElementById('measureSelect').value;
  const breakdown = document.getElementById('breakdownSelect').value;

  const groups = {};
  rows.forEach((r) => {
    const k = groupKey(r, breakdown);
    (groups[k] = groups[k] || []).push(r);
  });
  let labels = Object.keys(groups);
  if (breakdown === 'year') labels.sort();
  const values = labels.map((k) => measureFor(groups[k], measure));
  const colors = isPctMeasure(measure)
    ? values.map((v) => signColor(v, c))
    : labels.map((_, i) => c.series[i % c.series.length]);

  if (charts.breakdown) charts.breakdown.destroy();
  charts.breakdown = new Chart(document.getElementById('chartBreakdown'), {
    type: 'bar',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 4, maxBarThickness: 48 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip(c),
          callbacks: {
            label: (ctx) => isPctMeasure(measure) ? fmtPct(ctx.parsed.y) : fmtNumber(ctx.parsed.y),
          },
        },
      },
      scales: baseScales(c, {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => isPctMeasure(measure) ? v + '%' : fmtCompact(v) },
        },
      }),
    },
  });
}

// ---------- Chart 2: monthly trend (fixed) ----------

function renderTrendChart(rows) {
  const c = getColors();
  const groups = {};
  rows.forEach((r) => { (groups[r.ym] = groups[r.ym] || []).push(r.ret); });
  const labels = Object.keys(groups).sort();
  const values = labels.map((k) => mean(groups[k]));

  if (charts.trend) charts.trend.destroy();
  charts.trend = new Chart(document.getElementById('chartTrendDash'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values, borderColor: c.series[0], backgroundColor: c.series[0] + '1a',
        fill: true, tension: 0.15, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5,
        pointHoverBackgroundColor: c.series[0], pointHoverBorderColor: c.surface, pointHoverBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => fmtPct(ctx.parsed.y) } } },
      scales: baseScales(c, {
        x: { ticks: { maxTicksLimit: 8, maxRotation: 0 } },
        y: { beginAtZero: false, ticks: { callback: (v) => v + '%' } },
      }),
    },
  });
}

// ---------- Chart 3: top gainers in current view ----------

function renderGainersChart(rows) {
  const c = getColors();
  const top = [...rows].sort((a, b) => b.ret - a.ret).slice(0, 10);

  if (charts.gainers) charts.gainers.destroy();
  charts.gainers = new Chart(document.getElementById('chartGainersDash'), {
    type: 'bar',
    data: {
      labels: top.map((r) => r.sym),
      datasets: [{ data: top.map((r) => r.ret), backgroundColor: c.series[0], borderRadius: 4, maxBarThickness: 18 }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip(c),
          callbacks: {
            title: (items) => `${top[items[0].dataIndex].sym} · ${top[items[0].dataIndex].ym}`,
            label: (ctx) => fmtPct(ctx.parsed.x),
          },
        },
      },
      scales: baseScales(c, { x: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });
}

// ---------- Chart 4: return distribution ----------

function renderDistributionChart(rows) {
  const c = getColors();
  const bins = [
    { label: '< -50%', test: (v) => v < -50 },
    { label: '-50 to -20%', test: (v) => v >= -50 && v < -20 },
    { label: '-20 to -10%', test: (v) => v >= -20 && v < -10 },
    { label: '-10 to 0%', test: (v) => v >= -10 && v < 0 },
    { label: '0 to 10%', test: (v) => v >= 0 && v < 10 },
    { label: '10 to 20%', test: (v) => v >= 10 && v < 20 },
    { label: '20 to 50%', test: (v) => v >= 20 && v < 50 },
    { label: '> 50%', test: (v) => v >= 50 },
  ];
  const counts = bins.map((b) => rows.reduce((n, r) => n + (b.test(r.ret) ? 1 : 0), 0));
  const colors = bins.map((b) => (b.label.includes('-') && !b.label.startsWith('0') ? c.series[7] : c.series[0]));

  if (charts.dist) charts.dist.destroy();
  charts.dist = new Chart(document.getElementById('chartDist'), {
    type: 'bar',
    data: { labels: bins.map((b) => b.label), datasets: [{ data: counts, backgroundColor: colors, borderRadius: 4, maxBarThickness: 40 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => `${fmtNumber(ctx.parsed.y)} ticker-months` } } },
      scales: baseScales(c, { x: { ticks: { maxRotation: 0, font: { size: 10 } } }, y: { beginAtZero: true, ticks: { callback: (v) => fmtCompact(v) } } }),
    },
  });
}

// ---------- Table ----------

function renderTable(rows) {
  const sorted = [...rows].sort((a, b) => {
    const dir = sortState.dir === 'asc' ? 1 : -1;
    const av = a[sortState.key], bv = b[sortState.key];
    if (typeof av === 'string') return av.localeCompare(bv) * dir;
    return (av - bv) * dir;
  });
  const shown = sorted.slice(0, 300);
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = shown.map((r) => `
    <tr>
      <td>${r.sym}</td>
      <td>${EXCHANGE_NAMES[r.exch] || r.exch}${r.etf === 'Y' ? ' · ETF' : ''}</td>
      <td>${r.ym}</td>
      <td>$${r.open.toFixed(2)}</td>
      <td>$${r.close.toFixed(2)}</td>
      <td>${fmtNumber(r.volume)}</td>
      <td class="${r.ret >= 0 ? 'positive' : 'negative'}">${fmtPct(r.ret)}</td>
    </tr>`).join('');
  document.getElementById('tableNote').textContent =
    `Showing ${fmtNumber(shown.length)} of ${fmtNumber(rows.length)} ticker-months in view, sorted by ${sortState.key} (${sortState.dir}).`;
}

function setupTableSort() {
  document.querySelectorAll('#dataTable thead th').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortState.key === key) sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      else { sortState.key = key; sortState.dir = 'desc'; }
      renderTable(filteredRows());
    });
  });
}

// ---------- Orchestration ----------

function renderAll() {
  const rows = filteredRows();
  document.getElementById('resultNote').textContent =
    `${fmtNumber(rows.length)} of ${fmtNumber(ROWS.length)} ticker-months match the current filters.`;
  renderSummary(rows);
  renderBreakdownChart(rows);
  renderTrendChart(rows);
  renderGainersChart(rows);
  renderDistributionChart(rows);
  renderTable(rows);
}

function resetFilters() {
  document.getElementById('filterYear').value = '';
  document.getElementById('filterTicker').value = '';
  document.getElementById('filterExchange').value = '';
  document.getElementById('filterAssetType').value = '';
  document.getElementById('measureSelect').value = 'avgReturn';
  document.getElementById('breakdownSelect').value = 'year';
  renderAll();
}

async function init() {
  ROWS = await loadData();
  document.getElementById('loadingNote').remove();
  document.getElementById('dashboardBody').style.display = '';
  populateFilterOptions(ROWS);
  setupTableSort();

  ['filterYear', 'filterExchange', 'filterAssetType', 'measureSelect', 'breakdownSelect']
    .forEach((id) => document.getElementById(id).addEventListener('change', renderAll));
  document.getElementById('filterTicker').addEventListener('input', debounce(renderAll, 200));
  document.getElementById('resetFilters').addEventListener('click', resetFilters);

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
