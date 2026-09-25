#!/usr/bin/env bash
# Extends data/monthly_stock_data.csv (2015-2019, from build_monthly_data.sh)
# with a 2020-present slice fetched from Yahoo Finance, for the 1,000 tickers
# with the highest average monthly volume in the 2015-2019 data. Produces the
# final combined data/monthly_stock_data.csv spanning 2015-present, tagged
# with an Era column.
#
# Requires: jq (https://jqlang.org), curl, GNU awk (gawk, for strftime()).
#
# Run this ONCE, immediately after build_monthly_data.sh, while
# data/monthly_stock_data.csv is still that script's 2015-2019-only,
# 14-column output. This script overwrites it with the final combined,
# 13-column, 2015-present file - running it a second time against its own
# output will fail, since the schema has already changed.
#
# Usage: scripts/build_2020present_and_merge.sh
set -euo pipefail

DATA_DIR="$(cd "$(dirname "$0")/.." && pwd)/data"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# 1. Rank the existing 2015-2019 file by average monthly volume, take the top 1,000.
awk -F',' 'NR>1{v[$1]+=$12;c[$1]++} END{for(t in c) printf "%.0f,%s\n", v[t]/c[t], t}' \
  "$DATA_DIR/monthly_stock_data.csv" | sort -t',' -k1,1 -rn | head -1000 | cut -d',' -f2 \
  > "$WORK/top1000.txt"

# 2. Fetch monthly OHLCV + Exchange/InstrumentType for each, Jan 2020 to now.
P1=1577836800   # 2020-01-01 UTC
P2=$(date +%s)
mkdir -p "$WORK/fetched"
cat "$WORK/top1000.txt" | xargs -P 20 -I{} sh -c \
  'scripts/fetch_yahoo_ticker.sh "$1" '"$P1"' '"$P2"' jq > "'"$WORK"'/fetched/$1.csv" 2>/dev/null' _ {}
cat "$WORK"/fetched/*.csv > "$WORK/raw_2020present.csv"

# 3. Normalize exchange names/instrument types to match the 2015-2019 file's
#    categories, compute Year/YearMonth/ReturnPct, and apply the same kind of
#    data-quality filter as build_monthly_data.sh (see README for why).
awk -F',' -v OFS=',' '
function norm_exch(e) {
  gsub(/"/,"",e)
  if (e ~ /^Nasdaq/) return "Nasdaq"
  if (e == "NYSEArca") return "NYSE Arca"
  if (e == "NYSE American") return "NYSE American"
  if (e == "NYSE") return "NYSE"
  if (e ~ /^Cboe/) return "Cboe BZX"
  return "OTC"
}
{
  sym=$1; gsub(/"/,"",sym)
  exch = norm_exch($2)
  typ=$3; gsub(/"/,"",typ)
  etf = (typ=="ETF") ? "Y" : "N"
  ts=$4; o=$5; h=$6; l=$7; cl=$8; v=$9; adj=$10
  if (o=="" || cl=="" || o=="null" || cl=="null") next
  if (o+0 < 1 || o+0 > 2000) next
  if (cl+0 < 1 || h+0 < 1 || l+0 < 1) next   # excludes zero-price feed glitches
  ret = (cl - o) / o * 100
  if (ret > 200 || ret < -200) next
  if (etf=="Y" && (ret > 60 || ret < -60)) next
  ym = strftime("%Y-%m", ts, 1)
  yr = strftime("%Y", ts, 1)
  printf "%s,%s,%s,2020-present,%s,%s,%.2f,%.2f,%.2f,%.2f,%.2f,%.0f,%.2f\n", sym, exch, etf, yr, ym, o, h, l, cl, adj, v, ret
}
' "$WORK/raw_2020present.csv" > "$WORK/era_2020present.csv"

# 4. Re-tag the existing 2015-2019 file into the same 13-column schema
#    (normalize its Exchange codes to full names, drop MarketCategory/
#    TradingDays, add the Era column).
awk -F',' -v OFS=',' '
NR==1{next}
function norm_exch(e) {
  if (e=="A") return "NYSE American"
  if (e=="N") return "NYSE"
  if (e=="P") return "NYSE Arca"
  if (e=="Q") return "Nasdaq"
  if (e=="Z") return "Cboe BZX"
  return "Unknown"
}
{ print $1, norm_exch($2), $4, "2015-2019", $5, $6, $7, $8, $9, $10, $11, $12, $14 }
' "$DATA_DIR/monthly_stock_data.csv" > "$WORK/era_2015_2019.csv"

# 5. Combine and overwrite.
{
  echo "Symbol,Exchange,ETF,Era,Year,YearMonth,MonthOpen,MonthHigh,MonthLow,MonthClose,MonthAdjClose,MonthVolume,ReturnPct"
  cat "$WORK/era_2015_2019.csv" "$WORK/era_2020present.csv"
} > "$DATA_DIR/monthly_stock_data.csv"

echo "Wrote $DATA_DIR/monthly_stock_data.csv ($(wc -l < "$DATA_DIR/monthly_stock_data.csv") lines)"
