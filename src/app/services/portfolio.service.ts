/**
 * File: portfolio.service.ts
 * Project: portfolio
 * File Created: Tuesday, 6th February 2018 3:33:01 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 8:23:47 pm
 * Modified By: Thibaut Jacob (thibautquentinjacob@gmail.com>)
 * -----
 * License:
 * MIT License
 * 
 * Copyright (c) 2018 Thibaut Jacob
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



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

    /**
     * Display custom message in the Snack bar
     * @params message: string
     * @return void
     */
    openSnackBar( message: string ): void {
        this.snackBar.open( message, '', {
            duration: 2000,
        });
    }

    /**
     * Fetch all orders from the portfolio for the input symbol and return them.
     * Stream the list of orders to all subscribed components.
     * @params symbol: string
     * @return List of orders: Observable[]
     */
    getOrders( symbol: string ): Observable<Order[]> {
        const orders: Order[] = [];
        this.portfolio.orders.map( order => {
            if ( order.symbol === symbol ) {
                orders.push( order );
            }
        });
        this.observableOrders.next( orders );
        return of( orders );
    }

    /**
     * Adds new order to the order queue and calls local function 'getOrders' to
     * send order state to components.
     * @params new order: Order, callback
     * @return void
     */
    order( order: Order, callback ): void {
        console.log( 'Received order', order );
        this.portfolio.orders.push( order );
        this.getOrders( order.symbol );
        callback();
    }

    /**
     * Reset portfolio state to default values
     * @params void
     * @return void
     */
    resetPortfolio(): void {
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

    /**
     * Update portfolio total value, equity value and cash
     * @params void
     * @return void
     */
    updatePortfolio(): void {
        // If portfolio is empty, set it to default values
        if ( !this.portfolio ) {
            this.resetPortfolio();
        }

        // Fetch information and Dispatch currently loaded symbol to all components
        if ( this.loadedSymbol ) {
            this.stockDataService.getStockQuote( this.loadedSymbol ).subscribe( quote => {
                this.observableOrderSymbol.next( quote );
            });
        }

        // Compute portfolio stock value
        let equities   = 0;
        const keys     = Object.keys( this.portfolio.stocks );
        const self     = this;
        const promises = [];
        // For each equity get latest quote and sum total equity value
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
        // Call done local function when through
        Promise.all( promises ).then( function() {
            self._done( equities );
        });
    }

    /**
     * Update portfolio total and equities and write the portfolio state to
     * local storage.
     * @params equities total value: number
     * @return void
     */
    private _done( equities: number ): void {
        this.portfolio.total        = this.portfolio.cash + equities;
        this.portfolio.equities     = equities;
        this.portfolio.totalDiff    = 0;
        this.portfolio.equitiesDiff = 0;
        // Write portfolio to local storage
        localStorage.setItem( 'portfolio', JSON.stringify( this.portfolio ));

        // Stream portfolio to subscribed components
        this.observablePortfolio.next( this.portfolio );
    }

    /**
     * Log current portfolio state (total value, cash value and equities value)
     * in array to keep an history over time.
     * @params void
     * @return void
     */
    logHistory(): void {
        if ( this.portfolio.history > 1 ) {
            // Get last recorded value
            const last = this.portfolio.history[this.portfolio.history.length - 1];
            // Only log if value changed
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
        // Trim history length
        while ( this.portfolio.history.length > 1000 ) {
            this.portfolio.history.shift();
        }
    }

    /**
     * Simulate order execution with market latency and opening hours.
     * @params void
     * @return void
     */
    simulateOrderResolve(): void {
        // Generate random market latency between 0 and 10 seconds
        const marketLatency = Math.round( Math.random() * 10 * 1000 );
        setTimeout(() => {
            const refDate = new Date();
            // FIXME: use GMT
            // NY Market is opened between 9:30 and 16
            this.marketOpened =
                ( refDate.getHours() > 15 && refDate.getHours() <= 21 ) ||
                ( refDate.getHours() === 15 && refDate.getMinutes() >= 30 ) ||
                ( refDate.getHours() === 22 && refDate.getMinutes() === 0 );
            let update = false;
            // If market is opened
            if ( this.marketOpened ) {
                // For each order
                this.portfolio.orders.map( order => {
                    if ( order.remaining == null ) {
                        order.remaining        = order.volume;
                        order.resolvedAvgValue = 0;
                    }
                    // If order is waiting to be processed
                    if ( order.resolved === '-- OPEN --' ) {
                        const date = new Date();
                        update = true;
                        // If the order action is buy and the user has enough
                        // cash or if the order is sell and the user has enough
                        // stocks, call local 'treatOrder' function to resolve
                        // order.
                        if (( order.action === 'buy' && this.portfolio.cash >= order.totalCost ) ||
                            ( order.action === 'sell' && this.portfolio.stocks[order.symbol] &&
                              this.portfolio.stocks[order.symbol].volume >= order.remaining )
                            ) {
                            this.treatOrder( order, ( newOrder ) => {
                                order = newOrder;
                            });
                        // Otherwise deny order
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
            // If we have to update, dispatch the new state of orders to all 
            // subscribed components
            if ( update ) {
                this.observableOrders.next( this.portfolio.orders );
            }
        }, marketLatency );
    }

    /**
     * Resolve order
     * @params order to resolve: Order, callback to pass new state of order
     * @return void
     */
    treatOrder( order: Order, callback: ( order: Order ) => void ): void {
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
                order.symbol + ' at ' + order.limit + ')'
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
                        ' at ' + order.limit + ')'
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

                console.log( 'Adding ' + tradingVolume );
                // Pay price from cash
                const price = tradingVolume * quote.ask;
                this.portfolio.cash    -= price;
                order.resolvedAvgValue -= price;
                // If the user doesn't own this stock yet, create stock entry
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
                        ' at ' + order.limit + ')'
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

    /**
     * Check that there is enough cash to complete order
     * @params total price: number
     * @return boolean
     */
    checkEnoughCash( total: number ): boolean {
        return this.portfolio.cash >= Math.abs( total );
    }

    /**
     * Check that input volume is inferior or equal to the currently owned
     * volume for a given symbol.
     * @params symbol: string, volume: number
     * @return boolean
     */
    checkEnoughStocks( symbol: string, volume: number ): boolean {
        if ( this.portfolio.stocks[symbol]) {
            return this.portfolio.stocks[symbol].volume >= volume;
        }
        return false;
    }

    /**
     * Change currently loaded symbol to input symbol and dispatch the change to
     * all subscribed components.
     * @params symbol: string
     * @return void
     */
    setLoadedSymbol( symbol: string ): void {
        this.loadedSymbol = symbol;
        this.observableLoadedSymbol.next( this.loadedSymbol );
    }
}
