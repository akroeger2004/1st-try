#!/usr/bin/env bash
# Fetches one ticker's monthly OHLCV history from Yahoo Finance's public
# chart API and prints CSV rows: Symbol,Exchange,Type,Timestamp,Open,High,Low,Close,Volume,AdjClose
# Usage: fetch_yahoo_ticker.sh SYMBOL PERIOD1 PERIOD2 JQ_PATH
set -uo pipefail
SYM="$1"
P1="$2"
P2="$3"
JQ="$4"

json=$(curl -s --max-time 15 -A "Mozilla/5.0" \
  "https://query1.finance.yahoo.com/v8/finance/chart/${SYM}?period1=${P1}&period2=${P2}&interval=1mo")

[ -z "$json" ] && exit 0

"$JQ" -r --arg sym "$SYM" '
  .chart.result[0] as $r |
  select($r != null) |
  ($r.meta.fullExchangeName // "Unknown") as $exch |
  ($r.meta.instrumentType // "Unknown") as $type |
  $r.indicators.quote[0] as $q |
  ($r.indicators.adjclose[0].adjclose // $q.close) as $adj |
  range(0; ($r.timestamp | length)) as $i |
  select($q.open[$i] != null and $q.close[$i] != null) |
  [$sym, $exch, $type, $r.timestamp[$i], $q.open[$i], $q.high[$i], $q.low[$i], $q.close[$i], $q.volume[$i], $adj[$i]] | @csv
' <<< "$json" 2>/dev/null
