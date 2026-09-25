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
];

const BY_YEAR = [
  ['2015', -0.721], ['2016', 0.958], ['2017', 0.695], ['2018', -1.332], ['2019', 1.160],
];

const TOP_GAINERS = [
  ['ZGNX', 193.31, '2017-09'], ['DTSS', 193.00, '2018-03'], ['VERI', 192.66, '2017-09'],
  ['PNTG', 192.52, '2019-10'], ['MYSZ', 190.91, '2018-01'], ['XFOR', 190.30, '2018-11'],
  ['CAPR', 188.57, '2017-09'], ['BCDA', 184.21, '2016-12'], ['RLMD', 180.00, '2019-10'],
  ['TLRY', 176.51, '2018-08'],
];

const TOP_LOSERS = [
  ['EIC', -98.86, '2015-02'], ['EIC', -98.73, '2016-10'], ['CIH', -98.70, '2019-06'],
  ['IFS', -96.78, '2017-03'], ['IMUX', -96.60, '2018-09'], ['EIC', -96.34, '2015-12'],
  ['SBE', -96.30, '2016-05'], ['VERB', -96.25, '2015-10'], ['HMI', -94.83, '2015-06'],
  ['CIH', -94.77, '2016-02'],
];

const STOCKS_VS_ETFS = [
  { label: 'Individual stocks', avgReturn: 0.118, count: 255371, avgVolume: 21046541 },
  { label: 'ETFs', avgReturn: 0.280, count: 94716, avgVolume: 15257414 },
];

const BY_EXCHANGE = [
  ['NYSE American', -0.806, 7107], ['NYSE', 0.193, 127664], ['NYSE Arca', 0.240, 70724],
  ['Nasdaq', 0.126, 132955], ['Cboe BZX', 0.335, 11637],
];

const CONSISTENCY = [
  ['NEAR', 85.0], ['MINT', 85.0], ['SHV', 78.3], ['FLOT', 78.3], ['WCN', 76.7],
  ['ULST', 76.7], ['TFLO', 76.7], ['RAVI', 76.7], ['LDUR', 76.7], ['CPRT', 76.7],
];

const TOP_VOLUME = [
  ['SPY', 1954399237], ['BAC', 1651531732], ['AMD', 1420599852], ['EEM', 1337420237],
  ['GE', 1273769625], ['XLF', 1192891520], ['GDX', 1147802770], ['F', 767366522],
  ['AAPL', 752702383], ['CHK', 699116123],
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
}

document.addEventListener('DOMContentLoaded', renderReportCharts);
