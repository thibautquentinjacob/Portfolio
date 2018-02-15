import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { PortfolioService } from '../../services/portfolio.service';

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

export interface News {
    date:    any;
    source:  string;
    title:   string;
    content: string;
    link:    string;
}
