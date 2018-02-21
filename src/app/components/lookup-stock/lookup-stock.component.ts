/**
 * File: lookup-stock.component.ts
 * Project: portfolio
 * File Created: Wednesday, 7th February 2018 10:30:12 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 7:34:46 pm
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
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Symbol } from '../../models/Symbol';
import { StockDataService } from '../../services/stock-data.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-lookup-stock',
    templateUrl: './lookup-stock.component.html',
    styleUrls: ['./lookup-stock.component.css']
})
export class LookupStockComponent implements OnInit {

    symbols:         Symbol[];
    symbolCtrl:      FormControl;
    filteredSymbols: Observable<any[]>;
    symbol:          string;

    constructor( private stockDataService: StockDataService,
                 private portfolioService: PortfolioService ) {
        this.symbolCtrl       = new FormControl();
        this.stockDataService.getSupportedSymbols().subscribe( symbols => {
            this.symbols = symbols;
            this.filteredSymbols = this.symbolCtrl.valueChanges.pipe(
                startWith(''),
                map( symbol => symbol ? this.filterSymbols( symbol ) : this.symbols.slice( 0, 10 ))
            );
        });
    }

    ngOnInit() {
        this.symbols = [];
    }

    filterSymbols( name: string ) {
        return this.symbols.filter( symbol => {
            return symbol.symbol.toLowerCase().indexOf( name.toLowerCase()) === 0 ||
                   symbol.name.toLowerCase().indexOf( name.toLowerCase()) === 0;
        });
    }

    lookupSymbol() {
        this.portfolioService.setLoadedSymbol( this.symbol );
    }
}
