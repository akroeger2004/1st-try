// Report charts. All numbers here are computed once from
// data/monthly_stock_data.csv (see scripts/) and hard-coded — the report is
// a fixed narrative, unlike the dashboard, which recomputes everything live
// in the browser from the CSV.

const MONTHLY_TREND = [
  ['2015-01', -2.038], ['2015-02', 4.218], ['2015-03', -0.395], ['2015-04', 0.726],
  ['2015-05', 0.162], ['2015-06', -1.751], ['2015-07', -2.377], ['2015-08', -5.173],
  ['2015-09', -3.046], ['2015-10', 4.704], ['2015-11', 0.269], ['2015-12', -3.786],
  ['2016-01', -5.969], ['2016-02', 0.611], ['2016-03', 6.023], ['2016-04', 3.337],
  ['2016-05', -0.200], ['2016-06', 0.049], ['2016-07', 3.961], ['2016-08', 0.977],
  ['2016-09', 0.983], ['2016-10', -3.510], ['2016-11', 4.334], ['2016-12', 0.973],
  ['2017-01', 1.231], ['2017-02', 1.490], ['2017-03', -0.263], ['2017-04', 0.425],
  ['2017-05', -1.213], ['2017-06', 1.438], ['2017-07', 0.883], ['2017-08', -1.035],
  ['2017-09', 3.464], ['2017-10', 0.273], ['2017-11', 1.082], ['2017-12', 0.556],
  ['2018-01', 2.265], ['2018-02', -3.604], ['2018-03', -0.240], ['2018-04', 0.586],
  ['2018-05', 2.774], ['2018-06', -0.626], ['2018-07', 1.320], ['2018-08', 1.741],
  ['2018-09', -1.135], ['2018-10', -8.330], ['2018-11', -0.149], ['2018-12', -10.105],
  ['2019-01', 10.170], ['2019-02', 3.022], ['2019-03', -1.304], ['2019-04', 1.330],
  ['2019-05', -5.923], ['2019-06', 4.535], ['2019-07', -1.087], ['2019-08', -3.771],
  ['2019-09', 1.920], ['2019-10', 0.978], ['2019-11', 1.827], ['2019-12', 2.702],
  ['2020-01', -3.884], ['2020-02', -9.058], ['2020-03', -22.741], ['2020-04', 22.071],
  ['2020-05', 9.157], ['2020-06', 4.069], ['2020-07', 4.886], ['2020-08', 5.099],
  ['2020-09', -4.022], ['2020-10', -0.299], ['2020-11', 17.624], ['2020-12', 4.230],
  ['2021-01', 1.776], ['2021-02', 5.437], ['2021-03', 1.815], ['2021-04', 2.279],
  ['2021-05', 2.485], ['2021-06', -0.229], ['2021-07', -3.303], ['2021-08', 0.585],
  ['2021-09', -3.320], ['2021-10', 3.883], ['2021-11', -4.442], ['2021-12', 1.667],
  ['2022-01', -3.369], ['2022-02', -0.342], ['2022-03', 2.506], ['2022-04', -8.128],
  ['2022-05', 0.206], ['2022-06', -10.712], ['2022-07', 8.071], ['2022-08', -1.511],
  ['2022-09', -9.117], ['2022-10', 7.872], ['2022-11', 6.061], ['2022-12', -5.068],
  ['2023-01', 9.232], ['2023-02', -4.054], ['2023-03', -1.492], ['2023-04', -0.989],
  ['2023-05', -3.173], ['2023-06', 7.190], ['2023-07', 5.664], ['2023-08', -3.707],
  ['2023-09', -5.263], ['2023-10', -4.722], ['2023-11', 8.488], ['2023-12', 7.119],
  ['2024-01', -2.003], ['2024-02', 2.457], ['2024-03', 4.490], ['2024-04', -4.074],
  ['2024-05', 3.912], ['2024-06', -2.313], ['2024-07', 4.108], ['2024-08', -0.112],
  ['2024-09', 3.125], ['2024-10', -1.772], ['2024-11', 4.465], ['2024-12', -5.414],
  ['2025-01', 2.748], ['2025-02', 0.233], ['2025-03', -4.427], ['2025-04', -2.684],
  ['2025-05', 4.954], ['2025-06', 3.891], ['2025-07', 1.461], ['2025-08', 6.524],
  ['2025-09', 3.612], ['2025-10', 0.110], ['2025-11', 2.057], ['2025-12', 0.956],
  ['2026-01', 3.192], ['2026-02', 4.144], ['2026-03', -3.686], ['2026-04', 6.180],
  ['2026-05', 2.186], ['2026-06', 0.441], ['2026-07', 1.725], ['2026-08', 1.793],
  ['2026-09', -1.761],
];

const BY_YEAR = [
  ['2015', -0.721], ['2016', 0.958], ['2017', 0.695], ['2018', -1.332], ['2019', 1.160],
  ['2020', 2.270], ['2021', 0.713], ['2022', -1.134], ['2023', 1.189], ['2024', 0.569],
  ['2025', 1.623], ["2026*", 1.244],
];

// Same 805 companies in both eras (not the full 2015-2019 universe vs. a
// subset) - isolates the time-period effect from survivorship bias.
const ERA_COMPARISON = [
  { label: '2015-2019', avgReturn: 0.434, count: 42860 },
  { label: '2020-present', avgReturn: 0.915, count: 64365 },
];

// Top 15 individual stocks (ETFs excluded) ranked by cross-era consistency:
// min(% of 2015-2019 months positive, % of 2020-present months positive).
// Full ranked list of ~100 stocks + ETFs is explorable in the dashboard.
const CROSS_ERA_LEADERS = [
  { sym: 'NVDA', r1: 4.680, r2: 5.221 }, { sym: 'KO', r1: 0.565, r2: 0.618 },
  { sym: 'PWR', r1: 0.821, r2: 3.740 }, { sym: 'COF', r1: 0.301, r2: 1.393 },
  { sym: 'AFL', r1: 0.970, r2: 1.112 }, { sym: 'TSM', r1: 1.380, r2: 2.628 },
  { sym: 'LLY', r1: 1.106, r2: 3.013 }, { sym: 'COST', r1: 1.345, r2: 1.572 },
  { sym: 'TER', r1: 2.146, r2: 3.023 }, { sym: 'NFLX', r1: 3.839, r2: 1.569 },
  { sym: 'KLAC', r1: 1.774, r2: 3.718 }, { sym: 'FTNT', r1: 2.249, r2: 3.195 },
  { sym: 'EW', r1: 2.479, r2: 0.419 }, { sym: 'AAPL', r1: 1.523, r2: 2.133 },
  { sym: 'TSCO', r1: 0.537, r2: 0.874 },
];

// Top 10 performers OVER THE WHOLE PERIOD, ranked by a risk-adjusted score
// (mean monthly return / standard deviation of monthly returns - a monthly
// Sharpe-like ratio) among the 805 cross-era-tracked tickers, not by raw
// average return. A plain average is still dominated by one or two huge
// spike months for volatile names (e.g. Sarepta Therapeutics averaged
// +7.1%/month in 2015-2019, but that was driven almost entirely by two
// +100%+ months - see index.html section 3 for why that ticker was dropped
// in favor of this ranking). The bar height below is still the average
// monthly return (the number people read); the *ranking order* is the
// risk-adjusted score. Computed independently per era.
const TOP_2015_2019 = [
  { sym: 'FISV', score: 0.485, avg: 2.199 }, { sym: 'VCSH', score: 0.445, avg: 0.203 },
  { sym: 'ADBE', score: 0.439, avg: 2.617 }, { sym: 'RSG', score: 0.438, avg: 1.333 },
  { sym: 'CPRT', score: 0.431, avg: 2.794 }, { sym: 'GPN', score: 0.429, avg: 2.584 },
  { sym: 'SHOP', score: 0.422, avg: 5.347 }, { sym: 'SHY', score: 0.420, avg: 0.112 },
  { sym: 'TAL', score: 0.405, avg: 4.446 }, { sym: 'MA', score: 0.402, avg: 1.941 },
];

const TOP_2020_PRESENT = [
  { sym: 'PWR', score: 0.394, avg: 3.740 }, { sym: 'NVDA', score: 0.394, avg: 5.221 },
  { sym: 'DXJ', score: 0.360, avg: 1.503 }, { sym: 'MCK', score: 0.343, avg: 2.395 },
  { sym: 'LLY', score: 0.336, avg: 3.013 }, { sym: 'AVGO', score: 0.332, avg: 3.574 },
  { sym: 'SMH', score: 0.328, avg: 2.992 }, { sym: 'KLAC', score: 0.312, avg: 3.718 },
  { sym: 'JBL', score: 0.311, avg: 3.129 }, { sym: 'FLEX', score: 0.308, avg: 3.922 },
];

// Overlap between the two top-10 lists above, for the turnover chart. Under
// this stricter risk-adjusted ranking, zero tickers appear in both top 10s
// (NVDA is closest - #2 in 2020-present, but only #13 in 2015-2019).
const TURNOVER = [
  { label: '2015-2019 only', count: 10 },
  { label: 'Both eras', count: 0 },
  { label: '2020-present only', count: 10 },
];

const STOCKS_VS_ETFS = [
  { label: 'Individual stocks', avgReturn: 0.277, count: 309837, avgVolume: 41191630 },
  { label: 'ETFs', avgReturn: 0.283, count: 104615, avgVolume: 34638625 },
];

const BY_EXCHANGE = [
  ['NYSE American', -0.782, 7334], ['Nasdaq', 0.232, 151741], ['NYSE Arca', 0.254, 78759],
  ['Cboe BZX', 0.284, 12355], ['NYSE', 0.380, 164182],
];

// Ranked by share of months positive, min. 100 of 141 possible months present
const CONSISTENCY = [
  ['SPY', 66.9], ['DELL', 66.4], ['VOO', 66.2], ['IVV', 66.2], ['NVDA', 65.5],
  ['SVXY', 64.3], ['SSO', 64.1], ['MA', 64.1], ['IWF', 63.8], ['VTI', 63.4],
];

const TOP_VOLUME = [
  ['NVDA', 4654980229], ['TQQQ', 2470963175], ['SPY', 1758296106], ['TSLA', 1410043415],
  ['AAPL', 1279706144], ['AMD', 1274702672], ['BAC', 1257623167], ['NIO', 1257310882],
  ['AMZN', 1183624088], ['F', 1162924368],
];

function makeChart(id, config) {
  const el = document.getElementById(id);
  if (!el) return;
  new Chart(el, config);
}

function renderReportCharts() {
  const c = getColors();
  Chart.defaults.font.family = chartFont().family;
  Chart.defaults.color = c.textMuted;

  // 1. Monthly market trend (line)
  makeChart('chartTrend', {
    type: 'line',
    data: {
      labels: MONTHLY_TREND.map((d) => d[0]),
      datasets: [{
        data: MONTHLY_TREND.map((d) => d[1]),
        borderColor: c.series[0],
        backgroundColor: c.series[0] + '1a',
        fill: true,
        tension: 0.15,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: c.series[0],
        pointHoverBorderColor: c.surface,
        pointHoverBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => fmtPct(ctx.parsed.y) } },
      },
      scales: baseScales(c, {
        x: { ticks: { maxTicksLimit: 12, maxRotation: 0 } },
        y: { beginAtZero: false, ticks: { callback: (v) => v + '%' } },
      }),
    },
  });

  // 2. Average return by year (bar, diverging by sign)
  makeChart('chartByYear', {
    type: 'bar',
    data: {
      labels: BY_YEAR.map((d) => d[0]),
      datasets: [{
        data: BY_YEAR.map((d) => d[1]),
        backgroundColor: BY_YEAR.map((d) => signColor(d[1], c)),
        borderRadius: 4,
        maxBarThickness: 48,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => fmtPct(ctx.parsed.y) } },
      },
      scales: baseScales(c, { y: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // 3. Top 10 performers, whole 2015-2019 period (horizontal bar)
  makeChart('chartTop2015', {
    type: 'bar',
    data: {
      labels: TOP_2015_2019.map((d) => d.sym),
      datasets: [{
        data: TOP_2015_2019.map((d) => d.avg),
        backgroundColor: c.series[0],
        borderRadius: 4,
        maxBarThickness: 20,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip(c),
          callbacks: {
            title: (items) => TOP_2015_2019[items[0].dataIndex].sym,
            label: (ctx) => [`Avg monthly return: ${fmtPct(ctx.parsed.x)}`, `Risk-adjusted score: ${TOP_2015_2019[ctx.dataIndex].score.toFixed(3)}`],
          },
        },
      },
      scales: baseScales(c, { x: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // 4. Top 10 performers, whole 2020-present period (horizontal bar)
  makeChart('chartTop2020', {
    type: 'bar',
    data: {
      labels: TOP_2020_PRESENT.map((d) => d.sym),
      datasets: [{
        data: TOP_2020_PRESENT.map((d) => d.avg),
        backgroundColor: c.series[1],
        borderRadius: 4,
        maxBarThickness: 20,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip(c),
          callbacks: {
            title: (items) => TOP_2020_PRESENT[items[0].dataIndex].sym,
            label: (ctx) => [`Avg monthly return: ${fmtPct(ctx.parsed.x)}`, `Risk-adjusted score: ${TOP_2020_PRESENT[ctx.dataIndex].score.toFixed(3)}`],
          },
        },
      },
      scales: baseScales(c, { x: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // 5. Turnover between the two top-10 lists (bar)
  makeChart('chartTurnover', {
    type: 'bar',
    data: {
      labels: TURNOVER.map((d) => d.label),
      datasets: [{
        data: TURNOVER.map((d) => d.count),
        backgroundColor: [c.series[0], c.series[6], c.series[1]],
        borderRadius: 4,
        maxBarThickness: 64,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => `${ctx.parsed.y} of the 10 names` } },
      },
      scales: baseScales(c, { y: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } } }),
    },
  });

  // 6. Stocks vs ETFs (bar, categorical identity)
  makeChart('chartStocksEtfs', {
    type: 'bar',
    data: {
      labels: STOCKS_VS_ETFS.map((d) => d.label),
      datasets: [{
        data: STOCKS_VS_ETFS.map((d) => d.avgReturn),
        backgroundColor: [c.series[0], c.series[1]],
        borderRadius: 4,
        maxBarThickness: 64,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip(c),
          callbacks: {
            label: (ctx) => {
              const d = STOCKS_VS_ETFS[ctx.dataIndex];
              return [`Avg monthly return: ${fmtPct(d.avgReturn)}`, `Ticker-months: ${fmtNumber(d.count)}`];
            },
          },
        },
      },
      scales: baseScales(c, { y: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // 7. Average return by exchange (bar, diverging by sign)
  makeChart('chartByExchange', {
    type: 'bar',
    data: {
      labels: BY_EXCHANGE.map((d) => d[0]),
      datasets: [{
        data: BY_EXCHANGE.map((d) => d[1]),
        backgroundColor: BY_EXCHANGE.map((d) => signColor(d[1], c)),
        borderRadius: 4,
        maxBarThickness: 48,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip(c),
          callbacks: {
            label: (ctx) => {
              const d = BY_EXCHANGE[ctx.dataIndex];
              return [`Avg monthly return: ${fmtPct(d[1])}`, `Ticker-months: ${fmtNumber(d[2])}`];
            },
          },
        },
      },
      scales: baseScales(c, {
        x: { ticks: { maxRotation: 0, font: { size: 11 } } },
        y: { beginAtZero: true, ticks: { callback: (v) => v + '%' } },
      }),
    },
  });

  // 8. Most consistent gainers (horizontal bar)
  makeChart('chartConsistency', {
    type: 'bar',
    data: {
      labels: CONSISTENCY.map((d) => d[0]),
      datasets: [{
        data: CONSISTENCY.map((d) => d[1]),
        backgroundColor: c.series[0],
        borderRadius: 4,
        maxBarThickness: 20,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => `${ctx.parsed.x}% of months positive` } },
      },
      scales: baseScales(c, { x: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // 9. Highest average monthly trading volume (horizontal bar)
  makeChart('chartVolume', {
    type: 'bar',
    data: {
      labels: TOP_VOLUME.map((d) => d[0]),
      datasets: [{
        data: TOP_VOLUME.map((d) => d[1]),
        backgroundColor: c.series[0],
        borderRadius: 4,
        maxBarThickness: 20,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => `${fmtCompact(ctx.parsed.x)} shares/month avg` } },
      },
      scales: baseScales(c, { x: { beginAtZero: true, ticks: { callback: (v) => fmtCompact(v) } } }),
    },
  });

  // 10. Era comparison: 2015-2019 vs 2020-present (bar, categorical identity)
  makeChart('chartEra', {
    type: 'bar',
    data: {
      labels: ERA_COMPARISON.map((d) => d.label),
      datasets: [{
        data: ERA_COMPARISON.map((d) => d.avgReturn),
        backgroundColor: [c.series[0], c.series[1]],
        borderRadius: 4,
        maxBarThickness: 64,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...baseTooltip(c),
          callbacks: {
            label: (ctx) => {
              const d = ERA_COMPARISON[ctx.dataIndex];
              return [`Avg monthly return: ${fmtPct(d.avgReturn)}`, `Ticker-months: ${fmtNumber(d.count)}`];
            },
          },
        },
      },
      scales: baseScales(c, { y: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // Cross-era leaders: same stock's average return in each era (grouped bar, one axis)
  makeChart('chartCrossEra', {
    type: 'bar',
    data: {
      labels: CROSS_ERA_LEADERS.map((d) => d.sym),
      datasets: [
        { label: '2015-2019', data: CROSS_ERA_LEADERS.map((d) => d.r1), backgroundColor: c.series[0], borderRadius: 3, maxBarThickness: 14 },
        { label: '2020-present', data: CROSS_ERA_LEADERS.map((d) => d.r2), backgroundColor: c.series[1], borderRadius: 3, maxBarThickness: 14 },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top', labels: { color: c.textSecondary, font: chartFont(), boxWidth: 12 } },
        tooltip: { ...baseTooltip(c), callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtPct(ctx.parsed.y)}` } },
      },
      scales: baseScales(c, { y: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });
}

// This script tag sits at the end of <body>, so the DOM is already parsed
// by the time it runs - DOMContentLoaded may have already fired, which
// would silently drop a listener registered for it. Guard against that.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderReportCharts);
} else {
  renderReportCharts();
}
