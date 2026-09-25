// Shared helpers for both pages: palette lookup (reads the live CSS custom
// properties, so charts always match the active light/dark theme) and number
// formatting.

function getColors() {
  const s = getComputedStyle(document.documentElement);
  const v = (name) => s.getPropertyValue(name).trim();
  return {
    surface: v('--surface-1'),
    textPrimary: v('--text-primary'),
    textSecondary: v('--text-secondary'),
    textMuted: v('--text-muted'),
    gridline: v('--gridline'),
    baseline: v('--baseline'),
    good: v('--delta-good'),
    bad: v('--delta-bad'),
    series: [
      v('--series-1'), v('--series-2'), v('--series-3'), v('--series-4'),
      v('--series-5'), v('--series-6'), v('--series-7'), v('--series-8'),
    ],
  };
}

function chartFont() {
  return { family: "system-ui, -apple-system, 'Segoe UI', sans-serif" };
}

// Shared Chart.js defaults: hairline recessive gridlines, muted ticks, no
// dual axes anywhere in this codebase.
function baseScales(colors, opts = {}) {
  return {
    x: {
      grid: { color: colors.gridline, drawTicks: false },
      border: { color: colors.baseline },
      ticks: { color: colors.textMuted, font: chartFont(), maxRotation: 0, autoSkip: true },
      ...opts.x,
    },
    y: {
      grid: { color: colors.gridline, drawTicks: false },
      border: { display: false },
      ticks: { color: colors.textMuted, font: chartFont() },
      beginAtZero: opts.y && 'beginAtZero' in opts.y ? opts.y.beginAtZero : true,
      ...opts.y,
    },
  };
}

function baseTooltip(colors) {
  return {
    backgroundColor: colors.surface,
    titleColor: colors.textPrimary,
    bodyColor: colors.textSecondary,
    borderColor: colors.gridline,
    borderWidth: 1,
    padding: 10,
    titleFont: { weight: '600', ...chartFont() },
    bodyFont: chartFont(),
    displayColors: false,
  };
}

function fmtCompact(n) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

function fmtNumber(n) {
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

function fmtPct(n, digits = 2) {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(digits)}%`;
}

function signColor(n, colors) {
  return n >= 0 ? colors.series[0] : colors.series[7];
}
