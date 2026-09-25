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

const ERA_COMPARISON = [
  { label: '2015-2019 (full universe)', avgReturn: 0.162, count: 350243 },
  { label: '2020-present (top volume survivors)', avgReturn: 0.915, count: 64365 },
];

// All-time top 10, ranked across the full 2015-present dataset (not just one era)
const TOP_GAINERS = [
  ['ZGNX', 193.31, '2017-09'], ['DTSS', 193.00, '2018-03'], ['VERI', 192.66, '2017-09'],
  ['PNTG', 192.52, '2019-10'], ['MYSZ', 190.91, '2018-01'], ['XFOR', 190.30, '2018-11'],
  ['CAPR', 188.57, '2017-09'], ['ACB', 184.88, '2020-11'], ['BCDA', 184.21, '2016-12'],
  ['JMIA', 180.36, '2020-07'],
];

// Top 10 within the 2020-present era specifically
const TOP_GAINERS_RECENT = [
  ['ACB', 184.88, '2020-11'], ['JMIA', 180.36, '2020-07'], ['PGEN', 170.06, '2025-08'],
  ['SM', 169.43, '2020-11'], ['NBR', 168.16, '2020-05'], ['CGC', 159.94, '2024-03'],
  ['RIOT', 159.20, '2020-11'], ['AMC', 158.36, '2021-05'], ['RRC', 156.83, '2020-04'],
  ['MRNA', 155.51, '2026-08'],
];

const TOP_LOSERS = [
  ['EIC', -98.86, '2015-02'], ['EIC', -98.73, '2016-10'], ['CIH', -98.70, '2019-06'],
  ['IFS', -96.78, '2017-03'], ['IMUX', -96.60, '2018-09'], ['EIC', -96.34, '2015-12'],
  ['SBE', -96.30, '2016-05'], ['VERB', -96.25, '2015-10'], ['HMI', -94.83, '2015-06'],
  ['CIH', -94.77, '2016-02'],
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

  // 3. Top single-month gainers (horizontal bar)
  makeChart('chartGainers', {
    type: 'bar',
    data: {
      labels: TOP_GAINERS.map((d) => d[0]),
      datasets: [{
        data: TOP_GAINERS.map((d) => d[1]),
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
            title: (items) => `${items[0].label} · ${TOP_GAINERS[items[0].dataIndex][2]}`,
            label: (ctx) => fmtPct(ctx.parsed.x),
          },
        },
      },
      scales: baseScales(c, { x: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // 4. Steepest single-month losers (horizontal bar)
  makeChart('chartLosers', {
    type: 'bar',
    data: {
      labels: TOP_LOSERS.map((d) => d[0]),
      datasets: [{
        data: TOP_LOSERS.map((d) => d[1]),
        backgroundColor: c.series[7],
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
            title: (items) => `${items[0].label} · ${TOP_LOSERS[items[0].dataIndex][2]}`,
            label: (ctx) => fmtPct(ctx.parsed.x),
          },
        },
      },
      scales: baseScales(c, { x: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });

  // 5. Stocks vs ETFs (bar, categorical identity)
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

  // 6. Average return by exchange (bar, diverging by sign)
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

  // 7. Most consistent gainers (horizontal bar)
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

  // 8. Highest average monthly trading volume (horizontal bar)
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

  // 9. Era comparison: 2015-2019 vs 2020-present (bar, categorical identity)
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

  // 10. Top single-month gainers within the 2020-present era only (horizontal bar)
  makeChart('chartGainersRecent', {
    type: 'bar',
    data: {
      labels: TOP_GAINERS_RECENT.map((d) => d[0]),
      datasets: [{
        data: TOP_GAINERS_RECENT.map((d) => d[1]),
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
            title: (items) => `${items[0].label} · ${TOP_GAINERS_RECENT[items[0].dataIndex][2]}`,
            label: (ctx) => fmtPct(ctx.parsed.x),
          },
        },
      },
      scales: baseScales(c, { x: { beginAtZero: true, ticks: { callback: (v) => v + '%' } } }),
    },
  });
}

document.addEventListener('DOMContentLoaded', renderReportCharts);
