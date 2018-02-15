import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-summary-bar',
    templateUrl: './summary-bar.component.html',
    styleUrls: ['./summary-bar.component.css']
})
export class SummaryBarComponent implements OnInit {
    total:        number;
    totalDiff:    number;
    equities:     number;
    equitiesDiff: number;
    cash:         number;

    constructor( private portfolioService: PortfolioService ) {
        portfolioService.portfolioStream.subscribe( portfolio => {
            this.total        = portfolio.total;
            this.totalDiff    = portfolio.totalDiff;
            this.equities     = portfolio.equities;
            this.equitiesDiff = portfolio.equitiesDiff;
            this.cash         = portfolio.cash;
        });
    }

    ngOnInit() {
        this.total        = 0;
        this.totalDiff    = 0;
        this.equities     = 0;
        this.equitiesDiff = 0;
        this.cash         = 0;
    }
}
