import { Component, OnInit } from '@angular/core';
import { StockStats } from '../../models/StockStats';
import { StockDataService } from '../../services/stock-data.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-stock-stats',
    templateUrl: './stock-stats.component.html',
    styleUrls: ['./stock-stats.component.css']
})
export class StockStatsComponent implements OnInit {

    symbol:     string;
    last:       number;
    stockStats: StockStats;
    date:       any;

    constructor( private stockDataService: StockDataService,
                 private portfolioService: PortfolioService ) {
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.updateStockStats();
        });
    }

    ngOnInit() {
        this.symbol = 'MSFT';
        this.stockStats = null;
        this.date = new Date();
        this.date = this.date.toLocaleString();
        this.stockStats = {
            symbol:          this.symbol,
            date:            this.date,
            open:            0,
            high:            0,
            low:             0,
            close:           0,
            ask:             0,
            askSize:         0,
            bid:             0,
            bidSize:         0,
            pe:              0,
            eps:             0,
            beta:            0,
            vwap:            0,
            marketCap:       0,
            annualDividend:  0,
            yield:           0,
            revenuePerShare: 0,
            current:         0,
            diff:            0,
            last:            0,
            volume:          0
        };
        this.updateStockStats();
        setInterval( () => {
            this.updateStockStats();
        }, 10000 );
    }

    updateStockStats() {
        this.stockDataService.getStockQuote( this.symbol ).subscribe( quote => {
            // console.log( data );
            this.date = new Date();
            this.date = this.date.toLocaleString();
            const _stats = {
                symbol:          this.symbol,
                date:            this.date,
                open:            quote.open,
                high:            quote.high,
                low:             quote.high,
                close:           quote.close,
                ask:             quote.ask,
                askSize:         quote.askSize,
                bid:             quote.bid,
                bidSize:         quote.bidSize,
                pe:              quote.pe,
                eps:             0,
                beta:            0,
                vwap:            0,
                marketCap:       0,
                annualDividend:  0,
                yield:           0,
                revenuePerShare: 0,
                current:         quote.price,
                diff:            quote.diffPercent,
                last:            this.last,
                volume:          quote.volume
            };
            this.stockDataService.getDividends( this.symbol ).subscribe( dividend => {
                this.stockDataService.getKeyStats( this.symbol ).subscribe( stats => {
                    this.stockDataService.getVWAP( this.symbol ).subscribe( vwap => {
                        _stats.vwap            = vwap;
                        _stats.annualDividend  = dividend / 100;
                        _stats.yield           = stats.dividendYield / 100;
                        _stats.eps             = stats.latestEPS;
                        _stats.beta            = stats.beta;
                        _stats.marketCap       = stats.marketcap;
                        _stats.revenuePerShare = stats.revenuePerShare;
                        this.last              = quote.price;
                        this.stockStats        = _stats;
                    });
                });
            });
            // console.log( this.stockStats );
        });
    }
}
