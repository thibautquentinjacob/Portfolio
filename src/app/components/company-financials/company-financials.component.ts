import { Component, OnInit } from '@angular/core';
import { Financials } from '../../models/Financials';
import { CompanyDataService } from '../../services/company-data.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-company-financials',
    templateUrl: './company-financials.component.html',
    styleUrls: ['./company-financials.component.css']
})
export class CompanyFinancialsComponent implements OnInit {

    symbol: string;
    financials: Financials[];

    constructor( private companyDataService: CompanyDataService,
                 private portfolioService: PortfolioService ) {
        this.portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.updateFinancials();
        });
    }

    updateFinancials() {
        this.companyDataService.fetchFinancials( this.symbol ).subscribe( data =>  {
            // console.log( data );
            this.financials = data.financials;
        });
    }

    ngOnInit() {
        this.symbol = 'MSFT';
        this.updateFinancials();
    }
}
