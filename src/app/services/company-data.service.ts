import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CompanyDataService {

    private observableNews = new Subject<any>();
    newsStream             = this.observableNews.asObservable();
    url                    = 'https://api.iextrading.com/1.0/stock/';

    constructor( private http: HttpClient ) {}

    fetchData( symbol: string ): Observable<any> {
        return this.http.get(
            this.url + symbol + '/batch?types=company,logo'
        );
    }

    fetchFinancials( symbol: string ): Observable<any> {
        return this.http.get(
            this.url + symbol + '/financials'
        );
    }
}
