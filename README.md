# Stock Analysis — Data Website Project

Financial Data Analytics course project: a two-page site (a scrollable report
and an interactive dashboard) built around a panel of monthly U.S. stock and
ETF prices spanning 2015 through present, exploring which tickers, exchanges,
eras, and years produced the biggest gains and losses.

## Data

This dataset blends two sources so the panel can cover 2015 through the
present day without loading an unusably large file in the browser:

**2015–2019** — the full universe of 7,681 tickers, from the
[Stock Market Dataset](https://www.kaggle.com/datasets/jacksoncrow/stock-market-dataset)
by jacksoncrow on Kaggle (daily historical price/volume data for U.S. stocks
and ETFs, plus a NASDAQ/NYSE ticker metadata file, `symbols_valid_meta.csv`).
The raw download (daily data for 8,049 tickers, ~28M rows) is far too large to
load in a browser, so it's aggregated down to one row per ticker per calendar
month using `scripts/build_monthly_data.sh`.

**2020–present** — the 1,000 tickers with the highest average monthly volume
in that same 2015–2019 data (a fixed list derived entirely from the Kaggle
file, not chosen after seeing the outcome), fetched fresh from Yahoo
Finance's public historical-data endpoint via `scripts/fetch_yahoo_ticker.sh`
and `scripts/build_2020present_and_merge.sh`. Of the 1,000 tickers fetched,
805 still had usable trading data — the rest were delisted, acquired, or
renamed since 2015–2019.

**One row** = one ticker in one calendar month, tagged with an `Era` column
(`2015-2019` or `2020-present`) so the two sources stay distinguishable.

Rows dropped:
- **2015–2019**: from ~397,000 raw ticker-months, a row is dropped if the
  ticker had fewer than 15 trading days that month, its opening price was
  below $5 or above $500, or its computed return was beyond ±200% (±60% for
  ETFs) — in this source, moves beyond that threshold were almost always
  stock splits, ticker reassignment, or other data artifacts, most visibly a
  handful of tickers showing million-percent "gains." Test-issue tickers are
  also excluded.
- **2020–present**: of 1,000 fetched tickers, 195 returned no usable data at
  all. Individual ticker-months are dropped for a null price, an
  open/high/low/close below $1 (this excludes a small number of zero-price
  feed glitches — one, Agnico Eagle Mines in May 2021, would otherwise have
  shown a false "−100%" month), an opening price above $2,000, or a computed
  return beyond ±200% (±60% for ETFs).
- Combined, about 12% of raw ticker-months are dropped, leaving **414,608**.

**Known limitation:** the 2020–present slice can only show tickers that were
already among 2015–2019's top 1,000 by volume — it cannot surface a company
that IPO'd after 2019 becoming a top mover, since it was never a candidate
for inclusion. "All-time" rankings in the report are only as complete as that
fixed list.

How derived numbers are computed:
- `MonthOpen` / `MonthClose`: the opening price of the first trading day and
  closing price of the last trading day of that ticker's month.
- `MonthHigh` / `MonthLow`: the max daily high / min daily low across the
  month's trading days.
- `MonthVolume`: sum (2015–2019) or Yahoo's reported monthly total
  (2020–present) of volume across the month.
- `ReturnPct`: `(MonthClose - MonthOpen) / MonthOpen * 100`.
- Every "average return" reported in `index.html` is the simple
  (equal-weighted) mean of `ReturnPct` across the ticker-months in that group.

## Files

| File | What it does |
|---|---|
| `index.html` | The report page: title, summary, 6 headline numbers, 10 findings with charts, and a closing data-methodology section. |
| `dashboard.html` | The interactive dashboard: filters (era, year, ticker, exchange, asset type), 4 live summary numbers, 4 charts (one with measure + breakdown switches), a click-to-inspect ticker detail modal, a sortable data table, and a reset button. |
| `css/style.css` | Shared styles (nav bar, typography, color tokens, light/dark mode, modal) for both pages. |
| `js/common.js` | Shared chart color/formatting helpers used by both `report.js` and `dashboard.js`. |
| `js/report.js` | Builds the 10 static report charts from pre-computed numbers. |
| `js/dashboard.js` | Loads `data/monthly_stock_data.csv` and `data/tickers_meta.csv` in the browser and does all dashboard filtering, aggregation, chart rendering, and the ticker detail modal live. |
| `data/monthly_stock_data.csv` | The panel dataset: 414,608 rows, one per ticker per month (2015-01 to 2026-09), with Exchange/ETF/Era flags and OHLCV + return numbers. Fetched directly by `dashboard.html`. |
| `data/tickers_meta.csv` | Lookup table (8,049 rows, from the 2015–2019 Kaggle metadata): ticker → full security name, exchange, market category, ETF flag. Used for company names in the dashboard's ticker modal. |
| `scripts/build_ticker_meta.ps1` | PowerShell script that builds `data/tickers_meta.csv` from the raw Kaggle `symbols_valid_meta.csv`. |
| `scripts/build_monthly_data.sh` | Awk script that aggregates the raw 2015–2019 per-ticker daily CSVs into a monthly file. |
| `scripts/fetch_yahoo_ticker.sh` | Fetches one ticker's monthly OHLCV history from Yahoo Finance's public chart API. |
| `scripts/build_2020present_and_merge.sh` | Selects the top 1,000 tickers by 2015-2019 volume, fetches their 2020-present history via `fetch_yahoo_ticker.sh`, and merges everything into the final `data/monthly_stock_data.csv`. |
| `scripts/dev-server.ps1` | Minimal local static file server for previewing the site (`pwsh scripts/dev-server.ps1`, then open `http://localhost:8765/`). |

## Reproducing the data

```bash
# 1. Download & unzip jacksoncrow/stock-market-dataset from Kaggle to RAW_DIR
# 2. Build the ticker metadata lookup:
pwsh scripts/build_ticker_meta.ps1 -RawDir "RAW_DIR"
# 3. Aggregate 2015-2019 daily prices to monthly:
scripts/build_monthly_data.sh "RAW_DIR"
# 4. Fetch 2020-present for the top 1,000 tickers and merge (requires jq):
scripts/build_2020present_and_merge.sh
```
