import { Injectable } from '@angular/core';
import { StockDataService } from './stock-data.service';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Order } from '../models/Order';
import { Portfolio } from '../models/Portfolio';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class PortfolioService {
    private observablePortfolio    = new Subject<any>();
    portfolioStream                = this.observablePortfolio.asObservable();
    private observableOrders       = new Subject<any>();
    orderStream                    = this.observableOrders.asObservable();
    private observableOrderSymbol  = new Subject<any>();
    orderSymbolStream              = this.observableOrderSymbol.asObservable();
    openValues: {[index: string]: number };
    loadedSymbol                   = 'MSFT';
    private observableLoadedSymbol = new Subject<any>();
    loadedSymbolStream             = this.observableLoadedSymbol.asObservable();
    // Fetch portfolio stored in memory
    portfolio = JSON.parse( localStorage.getItem( 'portfolio' ));
    marketOpened                   = false;

    constructor( private stockDataService: StockDataService,
                 public snackBar: MatSnackBar ) {
        this.resetPortfolio();
        this.openValues = {};
        // Update portfolio every minute
        this.updatePortfolio();
        setInterval( () => {
            this.updatePortfolio();
        }, 10000 );

        // Order resolve function
        setInterval( () => {
            this.simulateOrderResolve();
        }, 1000 );

        // Log total, equities and cash history every hour
        setInterval( () => {
            this.logHistory();
        }, 60 * 1000 );
    }

    openSnackBar( message: string, action: string) {
        this.snackBar.open( message, action, {
            duration: 2000,
        });
    }

    getOrders( symbol: string ): Observable<any[]> {
        const orders: Order[] = [];
        this.portfolio.orders.map( order => {
            if ( order.symbol === symbol ) {
                orders.push( order );
            }
        });
        this.observableOrders.next( orders );
        return of( orders );
    }

    order( order: Order, callback ) {
        console.log( 'Received order', order );
        this.portfolio.orders.push( order );
        this.getOrders( order.symbol );
        callback();
    }

    resetPortfolio() {
        this.portfolio = {
            total: 0,
            totalDiff: 0,
            equities: 0,
            equitiesDiff: 0,
            cash: 10000000,
            stocks: {
                'FB': {
                    symbol: 'FB',
                    volume: 100,
                    boughtFor: 2000
                },
                'AAPL': {
                    symbol: 'AAPL',
                    volume: 50,
                    boughtFor: 2000
                },
                'BA': {
                    symbol: 'BA',
                    volume: 10,
                    boughtFor: 2000
                },
                'GE': {
                    symbol: 'GE',
                    volume: 100,
                    boughtFor: 2000
                }
            },
            orders: [],
            history: []
        };
    }

    updatePortfolio() {
        if ( !this.portfolio ) {
            this.portfolio = {
                total: 0,
                totalDiff: 0,
                equities: 0,
                equitiesDiff: 0,
                cash: 10000,
                stocks: {
                    'FB': {
                        symbol: 'FB',
                        volume: 20,
                        boughtFor: 2000
                    }
                },
                orders: [
                    {
                        date: '2017-02-02 19:23:06',
                        resolved: null,
                        symbol: 'FB',
                        volume: 20,
                        price: 3000,
                        resolvedPrice: null,
                        type: 'market',
                        duration: null,
                        action: 'buy',
                        minutes: null
                    }
                ],
                history: []
            };
        }

        // Update loaded symbol
        if ( this.loadedSymbol ) {
            this.stockDataService.getStockQuote( this.loadedSymbol ).subscribe( quote => {
                this.observableOrderSymbol.next( quote );
            });
        }

        // console.log( this.portfolio );
        // For each equity get latest quote
        // Compute portfolio stock value
        let equities = 0;
        const keys   = Object.keys( this.portfolio.stocks );

        const self = this;
        const promises = [];
        for ( let i = 0 ; i < keys.length ; i++ ) {
            const stock = keys[i];
            const promise = new Promise(( resolve, reject ) => {
                self.stockDataService.getStockQuote( stock ).subscribe( quote => {
                    equities += quote.price * self.portfolio.stocks[stock].volume;
                    self.portfolio.stocks[stock] = {
                        symbol:       stock,
                        currentValue: quote.price,
                        diff:         quote.diff,
                        diffPercent:  quote.diffPercent,
                        volume:       self.portfolio.stocks[stock].volume,
                        boughtFor:    self.portfolio.stocks[stock].boughtFor,
                    };
                    resolve();
                });
            });
            promises.push( promise );
        }
        Promise.all( promises ).then( function() {
            self.done( equities );
        });
    }

    done( equities: number ): void {
        this.portfolio.total        = this.portfolio.cash + equities;
        this.portfolio.equities     = equities;
        this.portfolio.totalDiff    = 0;
        this.portfolio.equitiesDiff = 0;
        localStorage.setItem( 'portfolio', JSON.stringify( this.portfolio ));

        // Stream portfolio to subscribed components
        this.observablePortfolio.next( this.portfolio );
    }

    logHistory(): void {
        // Only log if value changed
        // Get last recorded value
        if ( this.portfolio.history > 1 ) {
            const last = this.portfolio.history[this.portfolio.history.length - 1];
            if ( this.portfolio.total !== last.total ||
                this.portfolio.cash !== last.cash ||
                this.portfolio.equities !== last.equities ) {
                this.portfolio.history.push({
                    date:     new Date(),
                    total:    this.portfolio.total,
                    equities: this.portfolio.equities,
                    cash:     this.portfolio.cash
                });
            }
        } else {
            this.portfolio.history.push({
                date:     new Date(),
                total:    this.portfolio.total,
                equities: this.portfolio.equities,
                cash:     this.portfolio.cash
            });
        }
        // Keep the history length to a 1000 entries
        while ( this.portfolio.history.length > 1000 ) {
            this.portfolio.history.shift();
        }
    }

    simulateOrderResolve(): void {
        const marketLatency = Math.round( Math.random() * 10 * 1000 );
        setTimeout(() => {
            const refDate = new Date();
            this.marketOpened =
                ( refDate.getHours() > 15 && refDate.getHours() <= 21 ) ||
                ( refDate.getHours() === 15 && refDate.getMinutes() >= 30 ) ||
                ( refDate.getHours() === 22 && refDate.getMinutes() === 0 );
            let update = false;
            // For each order
            if ( this.marketOpened ) {
                this.portfolio.orders.map( order => {
                    if ( order.remaining == null ) {
                        order.remaining        = order.volume;
                        order.resolvedAvgValue = 0;
                    }
                    // console.log( order );
                    // If order is waiting to be processed and market is opened
                    if ( order.resolved === '-- OPEN --' ) {
                        const date = new Date();
                        update = true;
                        if (( order.action === 'buy' && this.portfolio.cash >= order.totalCost ) ||
                            ( order.action === 'sell' && this.portfolio.stocks[order.symbol] &&
                              this.portfolio.stocks[order.symbol].volume >= order.remaining )
                            ) {
                                this.treatOrder( order, ( newOrder ) => {
                                    order = newOrder;
                                });
                        } else {
                            console.log( 'Denying order' );
                            console.log( order );
                            console.log( this.portfolio.stocks );
                            console.log(
                                order.action, this.portfolio.cash, order.totalCost,
                                this.portfolio.stocks[order.symbol],
                                this.portfolio.stocks[order.symbol].volume,
                                order.volume
                            );
                            order.resolved = 'DENIED';
                        }
                    }
                });
            }
            if ( update ) {
                this.observableOrders.next( this.portfolio.orders );
            }
        }, marketLatency );
    }

    treatOrder( order: Order, callback ): void {
        const date      = new Date();
        const orderDate = new Date( order.date );
        const elapsed   = ( date.getTime() - orderDate.getTime()) / 1000;

        // 'DAY' orders expire at the end of the trading session
        // 'MINUTE' orders expire if delay is superior to the amount of minutes
        // 'AT THE OPENING' orders expire 1 min after the opening
        if (( order.duration === 'day' && !this.marketOpened ) ||
            ( order.duration === 'minute' && ( elapsed / 60 ) >= order.minutes ) ||
            ( order.duration === 'at the opening' && (
                date.getHours() > 15 || ( date.getHours() === 15 && date.getMinutes() > 31 )
            ))) {
            order.resolved = 'EXPIRED';
            this.openSnackBar(
                'Order expired (' + order.action + ' ' + order.volume + ' x ' +
                order.symbol + ' at ' + order.limit + ')', 'OK'
            );
        }

        // Get stock quote
        this.stockDataService.getStockQuote( order.symbol ).subscribe( quote => {
            let tradingVolume = 0;
            if ( order.remaining == null ) {
                order.remaining        = order.volume;
                order.resolvedAvgValue = 0;
            }
            tradingVolume = order.remaining;
            console.log( tradingVolume + ' remaining' );
            if ( order.action === 'buy' ) {
                // If we have a 'stop' order and it hasn't been triggered yet
                if (( order.order === 'stop-limit' || order.order === 'stop-market' ) &&
                    !order.triggered && quote.ask >= order.limit ) {
                    // Trigger stop order and transform it to either 'market' or 'limit'
                    order.triggered = true;
                    order.order = order.order.replace( 'stop-', '' );
                    this.openSnackBar(
                        'STOP order triggered (BUY ' + order.volume + ' x ' + order.symbol +
                        ' at ' + order.limit + ')', 'OK'
                    );
                } else if ( order.order === 'stop-limit' || order.order === 'stop-market' ) {
                    callback( order );
                    return;
                }

                // If we have a limit order and price is not in range
                if ( order.order === 'limit' && order.limit <= quote.ask ) {
                    callback( order );
                    return;
                }

                if ( order.remaining > quote.askSize ) {
                    order.remaining -= quote.askSize;
                    tradingVolume    = quote.askSize;
                    console.log( 'Volume exceeds ask size' );
                } else {
                    tradingVolume   = order.remaining;
                    order.remaining = 0;
                }
                // if ( order.order === 'limit' &&  ) {

                // }
                console.log( 'Adding ' + tradingVolume );
                // Pay price from cash
                const price = tradingVolume * quote.ask;
                this.portfolio.cash    -= price;
                order.resolvedAvgValue -= price;
                // If the user doesn't own this stock yet
                if ( !this.portfolio.stocks[order.symbol]) {
                    console.log( 'Creating stock' );
                    this.portfolio.stocks[order.symbol] = {
                        symbol: order.symbol,
                        volume: tradingVolume
                    };
                } else {
                    this.portfolio.stocks[order.symbol].volume += tradingVolume;
                    if ( this.portfolio.stocks[order.symbol].volume === 0 ) {
                        delete this.portfolio.stocks[order.symbol];
                    }
                }
            } else {
                // If we have a 'stop' order and it hasn't been triggered yet
                if (( order.order === 'stop-limit' || order.order === 'stop-market' ) &&
                    !order.triggered && quote.bid <= order.limit ) {
                    // Trigger stop order and transform it to either 'market' or 'limit'
                    order.triggered = true;
                    order.order = order.order.replace( 'stop-', '' );
                    this.openSnackBar(
                        'STOP order triggered (SELL ' + order.volume + ' x ' + order.symbol +
                        ' at ' + order.limit + ')', 'OK'
                    );
                } else if ( order.order === 'stop-limit' || order.order === 'stop-market' ) {
                    callback( order );
                    return;
                }

                // If we have a limit order and price is not in range
                if ( order.order === 'limit' && order.limit >= quote.bid ) {
                    callback( order );
                    return;
                }
                if ( order.remaining > quote.bidSize ) {
                    order.remaining -= quote.bidSize;
                    tradingVolume    = quote.bidSize;
                    console.log( 'Volume exceeds bid size' );
                } else {
                    tradingVolume   = order.remaining;
                    order.remaining = 0;
                }

                console.log( 'Selling ' + tradingVolume );
                const price = tradingVolume * quote.bid;
                // Fund price to cash
                this.portfolio.cash    += price;
                order.resolvedAvgValue += price;
                // Remove sold stocks
                this.portfolio.stocks[order.symbol].volume -= tradingVolume;
            }
            // Mark order as resolved if we traded the whole volume
            if ( order.remaining === 0 ) {
                const date = new Date();
                order.resolved = date.toLocaleString();
                this.portfolio.cash    -= 7;
                order.resolvedAvgValue -= 7;
            }
            callback( order );
        });
    }

    checkEnoughCash( total: number ): boolean {
        return this.portfolio.cash >= Math.abs( total );
    }

    checkEnoughStocks( symbol: string, volume: number ): boolean {
        if ( this.portfolio.stocks[symbol]) {
            return this.portfolio.stocks[symbol].volume >= volume;
        }
        return false;
    }

    setLoadedSymbol( symbol: string ): void {
        this.loadedSymbol = symbol;
        this.observableLoadedSymbol.next( this.loadedSymbol );
    }
}
