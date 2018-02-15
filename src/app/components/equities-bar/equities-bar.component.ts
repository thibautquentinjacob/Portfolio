import { Component, OnInit } from '@angular/core';
import { Equity } from '../../models/Equity';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-equities-bar',
    templateUrl: './equities-bar.component.html',
    styleUrls: ['./equities-bar.component.css']
})
export class EquitiesBarComponent implements OnInit {

    equities: Equity[];

    constructor( private portfolioService: PortfolioService ) {
        portfolioService.portfolioStream.subscribe( portfolio => {
            console.log( portfolio.stocks );
            this.equities = Object.values( portfolio.stocks );
        });
    }

    ngOnInit() {
        this.equities = [];
    }
}
