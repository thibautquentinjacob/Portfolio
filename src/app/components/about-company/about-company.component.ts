/**
 * File: about-company.component.ts
 * Project: portfolio
 * File Created: Saturday, 3rd February 2018 4:10:18 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 7:33:34 pm
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



import { Component, OnInit } from "@angular/core";
import { CompanyDataService } from '../../services/company-data.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-about-company',
    templateUrl: './about-company.component.html',
    styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit {

    symbol:      string;
    company:     string;
    industry:    string;
    website:     string;
    description: string;
    CEO:         string;
    sector:      string;
    image:       string;

    constructor( private companyDataService: CompanyDataService,
                 private portfolioService: PortfolioService ) {
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.setCompanyInfo();
        });
    }

    ngOnInit() {
        this.symbol = 'msft';
        this.setCompanyInfo();
    }

    setCompanyInfo() {
        this.companyDataService.fetchData( this.symbol ).subscribe( data => {
            // console.log( data );
            this.symbol      = data.company.symbol;
            this.company     = data.company.companyName;
            this.industry    = data.company.industry;
            this.website     = data.company.website;
            this.description = data.company.description;
            this.CEO         = data.company.CEO;
            this.sector      = data.company.sector;
            this.image       = data.logo.url;
        });
    }
}
