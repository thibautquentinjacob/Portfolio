/**
 * File: company-data.service.ts
 * Project: portfolio
 * File Created: Tuesday, 6th February 2018 7:36:40 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 7:41:14 pm
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
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';


// Service fetching company news, logo and information through the IEX API
@Injectable()
export class CompanyDataService {

    private observableNews = new Subject<any>();
    newsStream             = this.observableNews.asObservable();
    url                    = 'https://api.iextrading.com/1.0/stock/';

    constructor( private http: HttpClient ) {}

    /**
     * Fetches company information and logo from the IEX API
     * @params symbol: string
     * @return Observable
     */
    fetchData( symbol: string ): Observable<any> {
        return this.http.get(
            this.url + symbol + '/batch?types=company,logo'
        );
    }

    /**
     * Fetches company's last financials from the IEX API
     * @params symbol: string
     * @return Observable
     */
    fetchFinancials( symbol: string ): Observable<any> {
        return this.http.get(
            this.url + symbol + '/financials'
        );
    }
}
