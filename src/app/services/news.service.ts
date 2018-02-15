import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NewsService {

    private observableNews = new Subject<any>();
    newsStream             = this.observableNews.asObservable();
    url                    = 'https://api.iextrading.com/1.0/stock/';
    news                   = [];

    constructor( private http: HttpClient ) {}

    fetchNews( symbol: string ): Observable<any> {
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
