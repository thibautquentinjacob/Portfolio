/**
 * File: order-history.component.ts
 * Project: portfolio
 * File Created: Saturday, 3rd February 2018 5:31:00 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 7:34:42 pm
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
import { MatTableDataSource, MatSort } from '@angular/material';
import { Order } from '../../models/Order';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

    displayedColumns: string[];
    dataSource:       MatTableDataSource<Order>;
    symbol:           string;
    orders:           Order[];

    constructor( private portfolioService: PortfolioService ) {
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.portfolioService.getOrders( this.symbol ).subscribe( orders => {
                console.log( orders );
                this.orders = orders;
                this.dataSource = new MatTableDataSource<Order>( orders );
            });
        });
    }


    ngOnInit() {
        this.symbol = 'MSFT';
        this.orders = [];
        this.dataSource = new MatTableDataSource<Order>( this.orders );
        this.displayedColumns = [
            'date', 'resolved', 'order', 'limit', 'duration', 'action', 'orderValue',
            'totalCost', 'resolvedAvgValue', 'volume'
        ];
        this.portfolioService.getOrders( this.symbol ).subscribe( orders => {
            console.log( orders );
            this.orders = orders;
            this.dataSource = new MatTableDataSource<Order>( this.orders );
        });
        this.portfolioService.orderStream.subscribe( orders => {
            this.orders = [];
            orders.map( order => {
                if ( order.symbol === this.symbol ) {
                    this.orders.push( order );
                }
            });
            console.log( this.orders );
            this.dataSource = new MatTableDataSource<Order>( this.orders );
        });
    }
}
