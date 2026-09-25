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

Columns dropped/rows dropped:
- Test-issue tickers (`Test Issue = Y` in the source metadata) are excluded.
- Only trading days from 2015-01-01 through 2019-12-31 are included.

How derived numbers are computed:
- `MonthOpen` / `MonthClose`: the opening price of the first trading day and
  closing price of the last trading day of that ticker's month.
- `MonthHigh` / `MonthLow`: the max daily high / min daily low across the
  month's trading days.
- `MonthVolume`: sum of daily volume across the month.
- `ReturnPct`: `(MonthClose - MonthOpen) / MonthOpen * 100`.

## Files

| File | What it does |
|---|---|
| `data/monthly_stock_data.csv` | The panel dataset: 397,472 rows, one per ticker per month (2015-01 to 2019-12), with Exchange/MarketCategory/ETF flags and OHLCV + return numbers. Loaded directly by `dashboard.html`. |
| `data/tickers_meta.csv` | Lookup table (8,049 rows): ticker → full security name, exchange, market category, ETF flag. |
| `scripts/build_ticker_meta.ps1` | PowerShell script that builds `data/tickers_meta.csv` from the raw Kaggle `symbols_valid_meta.csv`. |
| `scripts/build_monthly_data.sh` | Awk script that aggregates the raw per-ticker daily CSVs into `data/monthly_stock_data.csv`. |
| `index.html` | The report page (findings, headline numbers, charts). |
| `dashboard.html` | The interactive dashboard (filters, switchable charts, data table). |

## Reproducing the data

```bash
# 1. Download & unzip jacksoncrow/stock-market-dataset from Kaggle to RAW_DIR
# 2. Build the ticker metadata lookup:
pwsh scripts/build_ticker_meta.ps1 -RawDir "RAW_DIR"
# 3. Aggregate daily prices to monthly:
scripts/build_monthly_data.sh "RAW_DIR"
```
