/**
 * File: company-news.component.ts
 * Project: portfolio
 * File Created: Saturday, 3rd February 2018 5:02:31 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 8:30:42 pm
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
import { NewsService } from '../../services/news.service';
import { PortfolioService } from '../../services/portfolio.service';
import { News } from '../../models/News';

@Component({
    selector: 'app-company-news',
    templateUrl: './company-news.component.html',
    styleUrls: ['./company-news.component.css']
})
export class CompanyNewsComponent implements OnInit {

    news:   News[];
    symbol: string;

    constructor( private newsService: NewsService,
                 private portfolioService: PortfolioService ) {
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.newsService.fetchNews( this.symbol ).subscribe( news => {
                this.news = news;
                console.log( news );
            });
        });
    }

    ngOnInit() {
        this.symbol = 'msft';
        this.newsService.fetchNews( this.symbol ).subscribe( news => {
            this.news = news;
        });
    }
}
