<#
Builds data/tickers_meta.csv from the raw Kaggle download's symbols_valid_meta.csv
(jacksoncrow/stock-market-dataset). Uses Import-Csv so quoted fields containing
commas (security names like "Agilent Technologies, Inc. Common Stock") are
parsed correctly, then re-exports only the columns the project needs.

Usage: scripts/build_ticker_meta.ps1 -RawDir "C:\path\to\raw_dir"
#>
param(
    [Parameter(Mandatory = $true)][string]$RawDir
)

$outDir = Join-Path (Split-Path $PSScriptRoot -Parent) "data"
$meta = Import-Csv (Join-Path $RawDir "symbols_valid_meta.csv")

$meta | Where-Object { $_.'Test Issue' -eq 'N' } |
    Select-Object Symbol,
        @{n = 'SecurityName'; e = { $_.'Security Name' } },
        @{n = 'Exchange'; e = { $_.'Listing Exchange' } },
        @{n = 'MarketCategory'; e = { $_.'Market Category'.Trim() } },
        ETF |
    Export-Csv -Path (Join-Path $outDir "tickers_meta.csv") -NoTypeInformation -Encoding UTF8

Write-Host "Wrote $(Join-Path $outDir 'tickers_meta.csv')"
