import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Symbol } from '../../models/Symbol';
import { StockDataService } from '../../services/stock-data.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-lookup-stock',
    templateUrl: './lookup-stock.component.html',
    styleUrls: ['./lookup-stock.component.css']
})
export class LookupStockComponent implements OnInit {

    symbols:         Symbol[];
    symbolCtrl:      FormControl;
    filteredSymbols: Observable<any[]>;
    symbol:          string;

    constructor( private stockDataService: StockDataService,
                 private portfolioService: PortfolioService ) {
        this.symbolCtrl       = new FormControl();
        this.stockDataService.getSupportedSymbols().subscribe( symbols => {
            this.symbols = symbols;
            this.filteredSymbols = this.symbolCtrl.valueChanges.pipe(
                startWith(''),
                map( symbol => symbol ? this.filterSymbols( symbol ) : this.symbols.slice( 0, 10 ))
            );
        });
    }

    ngOnInit() {
        this.symbols = [];
    }

    filterSymbols( name: string ) {
        return this.symbols.filter( symbol => {
            return symbol.symbol.toLowerCase().indexOf( name.toLowerCase()) === 0 ||
                   symbol.name.toLowerCase().indexOf( name.toLowerCase()) === 0;
        });
    }

    lookupSymbol() {
        this.portfolioService.setLoadedSymbol( this.symbol );
    }
}
