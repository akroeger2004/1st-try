# Stock Analysis — Data Website Project

Financial Data Analytics course project: a two-page site (a scrollable report
and an interactive dashboard) built around a panel of monthly U.S. stock and
ETF prices, exploring which tickers, sectors, and periods produced the
biggest gains and losses.

## Data

**Source:** [Stock Market Dataset](https://www.kaggle.com/datasets/jacksoncrow/stock-market-dataset)
by jacksoncrow on Kaggle — daily historical price/volume data for U.S.
stocks and ETFs, plus a NASDAQ/NYSE ticker metadata file
(`symbols_valid_meta.csv`).

The raw download (daily data for 8,049 tickers, ~28M rows) is far too large
to load in a browser, so it was aggregated down to one row per ticker per
calendar month for Jan 2015–Dec 2019, using the scripts in `scripts/`.

**One row** = one ticker in one calendar month.

Rows dropped from the raw ~397,000 ticker-months (see `scripts/build_monthly_data.sh`
for the aggregation and the filter applied on top of it):
- Test-issue tickers (`Test Issue = Y` in the source metadata) are excluded.
- Only trading days from 2015-01-01 through 2019-12-31 are included.
- A ticker-month is dropped if it has fewer than 15 trading days that month,
  if its opening price is below $5 or above $500, or if its computed return
  is beyond ±200% (±60% for ETFs). In this dataset, moves beyond that
  threshold were essentially always stock splits, ticker reassignment, or
  other data artifacts rather than real trading (one raw record showed a
  20-million-percent single-month "gain"). About 12% of ticker-months are
  dropped by these rules, leaving 350,243.

How derived numbers are computed:
- `MonthOpen` / `MonthClose`: the opening price of the first trading day and
  closing price of the last trading day of that ticker's month.
- `MonthHigh` / `MonthLow`: the max daily high / min daily low across the
  month's trading days.
- `MonthVolume`: sum of daily volume across the month.
- `ReturnPct`: `(MonthClose - MonthOpen) / MonthOpen * 100`.
- Every "average return" reported in `index.html` is the simple
  (equal-weighted) mean of `ReturnPct` across the ticker-months in that group.

## Files

| File | What it does |
|---|---|
| `index.html` | The report page: title, summary, 5 headline numbers, 8 findings with charts, and a closing data-methodology section. |
| `dashboard.html` | The interactive dashboard: filters (year, ticker, exchange, asset type), 4 live summary numbers, 4 charts (one with measure + breakdown switches), a sortable data table, and a reset button. |
| `css/style.css` | Shared styles (nav bar, typography, color tokens, light/dark mode) for both pages. |
| `js/common.js` | Shared chart color/formatting helpers used by both `report.js` and `dashboard.js`. |
| `js/report.js` | Builds the 8 static report charts from pre-computed numbers. |
| `js/dashboard.js` | Loads `data/monthly_stock_data.csv` in the browser and does all dashboard filtering, aggregation, and chart rendering live. |
| `data/monthly_stock_data.csv` | The panel dataset: 350,243 rows, one per ticker per month (2015-01 to 2019-12), with Exchange/MarketCategory/ETF flags and OHLCV + return numbers. Fetched directly by `dashboard.html`. |
| `data/tickers_meta.csv` | Lookup table (8,049 rows): ticker → full security name, exchange, market category, ETF flag. |
| `scripts/build_ticker_meta.ps1` | PowerShell script that builds `data/tickers_meta.csv` from the raw Kaggle `symbols_valid_meta.csv`. |
| `scripts/build_monthly_data.sh` | Awk script that aggregates the raw per-ticker daily CSVs into `data/monthly_stock_data.csv`. |
| `scripts/dev-server.ps1` | Minimal local static file server for previewing the site (`pwsh scripts/dev-server.ps1`, then open `http://localhost:8765/`). |

## Reproducing the data

```bash
# 1. Download & unzip jacksoncrow/stock-market-dataset from Kaggle to RAW_DIR
# 2. Build the ticker metadata lookup:
pwsh scripts/build_ticker_meta.ps1 -RawDir "RAW_DIR"
# 3. Aggregate daily prices to monthly:
scripts/build_monthly_data.sh "RAW_DIR"
```
