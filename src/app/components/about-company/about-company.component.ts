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
