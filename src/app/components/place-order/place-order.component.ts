/**
 * File: place-order.component.ts
 * Project: portfolio
 * File Created: Saturday, 3rd February 2018 5:54:51 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 7:34:39 pm
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



import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { StockDataService } from '../../services/stock-data.service';
import { Order } from '../../models/Order';

@Component({
    selector: 'app-place-order',
    templateUrl: './place-order.component.html',
    styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

    symbol:          string;
    bidPrice:        number;
    askPrice:        number;
    price:           number;
    brokerFee:       number;
    startDate = new Date();
    minutes:         number;
    limit:           number;
    duration:        string;
    hasEnoughCash:   boolean;
    hasEnoughStocks: boolean;

    order: Order;

    orders: string[] = [
        'market',
        'limit',
        'stop-market',
        'stop-limit'
    ];

    durationOrders: string[] = [
        'day',
        'gtc (Good-Til-Canceled)',
        'gtd (good til date)',
        'ioc (immediate or cancel)',
        'fok (fill or kill)',
        'aon (all or none)',
        'at the opening',
        'at the close',
        'minute'
    ];

    actions: string[] = [
        'buy',
        'sell'
    ];

    constructor( private portfolioService: PortfolioService,
                 private stockDataService: StockDataService ) {
        // When the loaded symbol change
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.order = {};
            this.order.symbol = symbol;
            this.symbol       = symbol;
            this.stockDataService.getStockQuote( this.order.symbol ).subscribe( quote => {
                this.price    = quote.price;
                this.bidPrice = quote.bid;
                this.askPrice = quote.ask;
                this.computePrice();
            });
        });
        // When the order symbol is updated
        portfolioService.orderSymbolStream.subscribe( quote => {
            this.price    = quote.price;
            this.bidPrice = quote.bid;
            this.askPrice = quote.ask;
            this.computePrice();
        });
    }

    ngOnInit() {
        this.hasEnoughCash   = false;
        this.hasEnoughStocks = false;
        this.order = {};
        this.order.symbol     = 'MSFT';
        this.symbol           = this.order.symbol;
        this.stockDataService.getStockQuote( this.order.symbol ).subscribe( quote => {
            this.price    = quote.price;
            this.bidPrice = quote.bid;
            this.askPrice = quote.ask;
        });
        this.brokerFee        = 7;
        this.order.totalCost  = 0;
        this.order.order      = null;
        this.order.action     = null;
        this.order.duration   = null;
        this.order.limit      = 0;
        this.order.volume     = 1;
        this.minutes          = 0;
    }

    computePrice() {
        // console.log( this.symbol );
        if ( this.order.volume > 0 ) {
            if ( this.order.action === 'sell' ) {
                if ( this.bidPrice !== 0 ) {
                    this.price = this.bidPrice;
                }
                this.order.orderValue = this.order.volume * this.price;
                this.order.totalCost  = this.order.orderValue - this.brokerFee;
                // Check that we have enough cash for the broker fee
                this.hasEnoughCash   = this.portfolioService.checkEnoughCash( this.brokerFee );
                this.hasEnoughStocks = this.portfolioService.checkEnoughStocks( this.symbol, this.order.volume );
            } else if ( this.order.action === 'buy' ) {
                if ( this.bidPrice !== 0 ) {
                    this.price = this.askPrice;
                }
                this.order.orderValue = - ( this.order.volume * this.price );
                this.order.totalCost  = this.order.orderValue - this.brokerFee;
                // Check that we have enough cash to pay the whole transaction
                this.hasEnoughCash = this.portfolioService.checkEnoughCash( this.order.totalCost );
            }
        }
    }

    placeOrder() {
        const date = new Date();
        this.order.date = date.toLocaleString();
        this.order.currency = 'dollars';
        this.order.resolved = '-- OPEN --';
        this.order.symbol   = this.symbol;
        this.order.limit    = this.limit;
        this.order.duration = this.duration;
        this.portfolioService.order( this.order, () => {
            this.order = {};
        });
    }
}
