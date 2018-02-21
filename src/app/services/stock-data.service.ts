// Copyright (c) 2018 thibautjacob
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../models/Stock';
import { StockQuote } from '../models/StockQuote';
import { Symbol } from '../models/Symbol';

@Injectable()
export class StockDataService {

    stockData:      Stock[];
    stockDataDay:   Stock[];
    stockQuoteData: StockQuote;

    constructor( private http: HttpClient ) {
        this.stockData      = [];
    }

    getStockQuote( symbol: string ): Observable<any> {
        let stockQuoteData: StockQuote;
        return this.http.get(
            'https://api.iextrading.com/1.0/stock/' + symbol + '/quote'
        ).pipe().map( data => {
            stockQuoteData = {
                price:       data['latestPrice'],
                symbol:      symbol,
                diff:        data['change'],
                diffPercent: data['changePercent'],
                open:        data['open'],
                close:       data['close'],
                high:        data['high'],
                low:         data['low'],
                volume:      data['latestVolume'],
                bid:         data['iexBidPrice'],
                bidSize:     data['iexBidSize'],
                ask:         data['iexAskPrice'],
                askSize:     data['iexAskSize'],
                pe:          data['peRatio'],
            };
            return stockQuoteData;
        });
    }

    getDayStockData( symbol: string ): Observable<any[]> {
        const stockDataDay: Stock[] = [];
        return this.http.get(
            'https://api.iextrading.com/1.0/stock/' + symbol + '/chart/1d'
        ).pipe().map( data => {
            // console.log( data );
            for ( let i = 0 ; i < Object.keys( data ).length ; i++ ) {
                if ( data[i].average !== 0 ) {
                    stockDataDay.push({
                        date:    new Date( data[i].date.replace( /(\d{4})(\d{2})(\d{2})/, '$1/$2/$3' ) + ' ' + data[i].minute ),
                        average: data[i].average,
                        high:    data[i].high,
                        low:     data[i].low,
                        volume:  data[i].volume
                    });
                }
            }
            return stockDataDay;
        });
    }

    getStockData( symbol: string ): Observable<any[]> {
        console.log( 'Requesting data for symbol ' + symbol );
        const stockData: Stock[] = [];
        return this.http.get(
            'https://api.iextrading.com/1.0/stock/' + symbol + '/chart/1y'
        ).pipe().map( data => {
            // console.log( data );
            for ( let i = 0 ; i < Object.keys( data ).length ; i++ ) {
                stockData.push({
                    date:   new Date( data[i].date.replace( /(\d{4})(\d{2})(\d{2})/, '$1/$2/$3' ) ),
                    open:   data[i].open,
                    high:   data[i].high,
                    low:    data[i].low,
                    close:  data[i].close,
                    volume: data[i].volume
                });
            }
            return stockData;
        });
    }

    computeSMA( dayPeriod: number, stocks, callback ) {
        let sum = 0;
        let firstValueIndex = 0;
        for ( let i = 0 ; i < stocks.length ; i++ ) {
            sum += stocks[i].close;
            if ( i >= dayPeriod - 1 ) {
                stocks[i]['SMA_' + dayPeriod] = Math.round( sum / dayPeriod * 100 ) / 100;
                firstValueIndex = i - dayPeriod + 1;
                sum -= stocks[firstValueIndex].close;
            }
        }
        callback( stocks );
    }

    computeEMA( dayPeriod: number, stocks, callback ) {
        const weightMultiplier = 2 / ( dayPeriod + 1 );
        this.computeSMA( dayPeriod, stocks, ( SMAStocks ) => {
            for ( let i = 0 ; i < SMAStocks.length ; i++ ) {
                if ( SMAStocks[i]['SMA_' + dayPeriod]) {
                    if ( SMAStocks[i - 1]['SMA_' + dayPeriod]) {
                        SMAStocks[i]['EMA_' + dayPeriod] =
                            Math.round(
                                (( SMAStocks[i].close - SMAStocks[i - 1]['EMA_' + dayPeriod]) *
                                weightMultiplier + SMAStocks[i - 1]['EMA_' + dayPeriod]) * 100
                            ) / 100;
                    } else {
                        SMAStocks[i]['EMA_' + dayPeriod] =
                            Math.round( SMAStocks[i]['SMA_' + dayPeriod] * 100 ) / 100;
                    }
                }
            }
            callback( SMAStocks );
        });
    }

    computeMcGinley( dayPeriod: number, stocks, callback ) {
        let previous = null;
        for ( let i = 0 ; i < stocks.length ; i++ ) {
            if ( i >= dayPeriod - 1 ) {
                if ( !previous ) {
                    stocks[i]['McGinley_' + dayPeriod] = stocks[i].close;
                } else {
                    stocks[i]['McGinley_' + dayPeriod] =
                        Math.round(
                            ( previous + ( stocks[i].close - previous ) /
                            ( dayPeriod / 2 * Math.pow( stocks[i].close / previous, 4 ))
                        ) * 100 ) / 100;
                }
                previous = stocks[i]['McGinley_' + dayPeriod];
            }
        }
        callback( stocks );
    }

    getSupportedSymbols(): Observable<any[]> {
        const symbols: Symbol[] = [];
        return this.http.get(
            'https://api.iextrading.com/1.0/ref-data/symbols'
        ).pipe().map( data => {
            for ( let i = 0 ; i < Object.keys( data ).length - 1 ; i++ ) {
                symbols.push({
                    symbol: data[i].symbol,
                    name:   data[i].name
                });
            }
            return symbols;
        });
    }

    getDividends( symbol: string ): Observable<any> {
        let dividends = 0;
        return this.http.get(
            'https://api.iextrading.com/1.0/stock/' + symbol + '/dividends/1y'
        ).pipe().map( data => {
            if ( data instanceof Array ) {
                data.map( div => {
                    dividends += div.amount;
                });
            }
            return Math.round( dividends * 100 ) / 100;
        });
    }

    getKeyStats( symbol: string ): Observable<any> {
        return this.http.get(
            'https://api.iextrading.com/1.0/stock/' + symbol + '/stats'
        );
    }

    getVWAP( symbol: string ): Observable<any> {
        return this.http.get(
            'https://api.iextrading.com/1.0/stock/' + symbol + '/chart'
        ).pipe().map( data => {
            if ( data instanceof Array && data.length > 0 ) {
                return data[data.length - 1].vwap;
            }
        });
    }
}
