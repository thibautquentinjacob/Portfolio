/**
 * File: news.service.ts
 * Project: portfolio
 * File Created: Tuesday, 6th February 2018 6:50:27 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 8:34:51 pm
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
import { News } from '../models/News';

@Injectable()
export class NewsService {

    private observableNews = new Subject<any>();
    newsStream             = this.observableNews.asObservable();
    url                    = 'https://api.iextrading.com/1.0/stock/';
    news: News[]           = [];

    constructor( private http: HttpClient ) {}

    /**
     * Download company news using the IEX API.
     * @params symbol: string
     * @return News list: Observable[]
     */
    fetchNews( symbol: string ): Observable<News[]> {
        this.news = [];
        return this.http.get(
            this.url + symbol + '/batch?types=news'
        ).pipe().map( data => {
            for ( let i = 0 ; i < data['news'].length ; i++ ) {
                const element = data['news'][i];
                this.news.push({
                    date:    element.datetime,
                    source:  element.source,
                    title:   element.headline,
                    content: element.summary,
                    link:    element.url
                });
            }
            return this.news;
        });
    }

}
