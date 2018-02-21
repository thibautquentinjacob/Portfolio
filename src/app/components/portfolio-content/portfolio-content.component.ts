/**
 * File: portfolio-content.component.ts
 * Project: portfolio
 * File Created: Saturday, 3rd February 2018 3:14:48 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 7:34:31 pm
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



import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-portfolio-content',
    templateUrl: './portfolio-content.component.html',
    styleUrls: ['./portfolio-content.component.css']
})
export class PortfolioContentComponent implements OnInit {

    equities:         Element[];
    displayedColumns: string[];
    dataSource:       MatTableDataSource<Element>;

    @ViewChild(MatSort) sort: MatSort;


    constructor( private portfolioService: PortfolioService ) {
        portfolioService.portfolioStream.subscribe( portfolio => {
            // console.log( portfolio.stocks );
            this.equities = [];
            Object.values( portfolio.stocks ).map( stock => {
                if ( stock.volume > 0 ) {
                    this.equities.push({
                        symbol:     stock.symbol,
                        value:      stock.currentValue,
                        diff:       stock.diffPercent,
                        totalDiff:  stock.diff * stock.volume,
                        volume:     stock.volume,
                        totalWorth: stock.volume * stock.currentValue,
                        currency:   '$'
                    });
                }
            });
            this.dataSource = new MatTableDataSource<Element>(this.equities);
        });
    }

    ngOnInit() {
        this.equities         = [];
        this.displayedColumns = ['volume', 'symbol', 'value', 'diff', 'totalDiff', 'totalWorth' ];
        this.dataSource       = new MatTableDataSource<Element>(this.equities);
    }

    /**
     * Set the sort after the view init since this component will
     * be able to query its view for the initialized sort.
     */
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
}

export interface Element {
    symbol:     string;
    value:      number;
    diff:       number;
    totalDiff:  number;
    volume:     number;
    totalWorth: number;
    currency:   string;
}
