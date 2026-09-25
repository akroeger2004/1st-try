#!/usr/bin/env bash
# Aggregates raw daily stock/ETF prices into data/monthly_stock_data.csv:
# one row per ticker per calendar month, Jan 2015 - Dec 2019.
#
# Run scripts/build_ticker_meta.ps1 first to produce data/tickers_meta.csv.
#
# Expects the raw Kaggle "Stock Market Dataset" download
# (jacksoncrow/stock-market-dataset) unzipped at $1, with:
#   <raw_dir>/stocks/<TICKER>.csv   one file per stock
#   <raw_dir>/etfs/<TICKER>.csv     one file per ETF
#   each with columns: Date,Open,High,Low,Close,Adj Close,Volume
#
# Usage: scripts/build_monthly_data.sh /path/to/raw_dir
set -euo pipefail

RAW_DIR="${1:?Usage: build_monthly_data.sh /path/to/raw_dir}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/data"
META_CSV="$OUT_DIR/tickers_meta.csv"

[ -f "$META_CSV" ] || { echo "Missing $META_CSV — run build_ticker_meta.ps1 first" >&2; exit 1; }

awk -F',' -v OFS=',' '
BEGIN {
  # tickers_meta.csv: Symbol,SecurityName,Exchange,MarketCategory,ETF
  # SecurityName may contain commas (it is double-quoted when it does), so
  # split on comma and read Exchange/MarketCategory/ETF from the END of the
  # line, which is safe regardless of how many commas the name contains.
  metafile = "'"$META_CSV"'"
  while ((getline line < metafile) > 0) {
    if (++metarow == 1) continue
    n = split(line, f, ",")
    sym = f[1]
    exch[sym] = f[n-2]; mcat[sym] = f[n-1]; etf[sym] = f[n]
  }
  close(metafile)
  print "Symbol,Exchange,MarketCategory,ETF,Year,YearMonth,MonthOpen,MonthHigh,MonthLow,MonthClose,MonthAdjClose,MonthVolume,TradingDays,ReturnPct"
}
function flush() {
  if (have) {
    ret = (mopen+0>0) ? sprintf("%.2f",(mclose-mopen)/mopen*100) : ""
    yr = substr(curym,1,4)
    print symbol, exch[symbol], mcat[symbol], etf[symbol], yr, curym, sprintf("%.2f",mopen), sprintf("%.2f",mhigh), sprintf("%.2f",mlow), sprintf("%.2f",mclose), sprintf("%.2f",madj), mvol+0, ndays, ret
  }
}
FNR==1 {
  flush(); have=0; curym=""
  n=split(FILENAME, parts, "/"); fn=parts[n]; sub(/\.csv$/,"",fn); symbol=fn
  next
}
{
  date=$1
  if (date < "2015-01-01" || date > "2019-12-31") next
  ym = substr(date,1,7)
  if (ym != curym) { flush(); curym=ym; mopen=$2; mhigh=$3; mlow=$4; mvol=0; ndays=0; have=1 }
  if ($3+0 > mhigh+0) mhigh=$3
  if ($4+0 < mlow+0) mlow=$4
  mclose=$5; madj=$6; mvol+=$7; ndays++
}
END { flush() }
' "$RAW_DIR"/stocks/*.csv "$RAW_DIR"/etfs/*.csv > "$OUT_DIR/monthly_stock_data.csv"

echo "Wrote $OUT_DIR/monthly_stock_data.csv"
