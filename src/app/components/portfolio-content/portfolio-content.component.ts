import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-portfolio-content',
    templateUrl: './portfolio-content.component.html',
    styleUrls: ['./portfolio-content.component.css']
})
export class PortfolioContentComponent implements OnInit {

    equities:         Element[];
    displayedColumns: string[];
    dataSource:       MatTableDataSource<Element>;

    @ViewChild(MatSort) sort: MatSort;


    constructor( private portfolioService: PortfolioService ) {
        portfolioService.portfolioStream.subscribe( portfolio => {
            // console.log( portfolio.stocks );
            this.equities = [];
            Object.values( portfolio.stocks ).map( stock => {
                if ( stock.volume > 0 ) {
                    this.equities.push({
                        symbol:     stock.symbol,
                        value:      stock.currentValue,
                        diff:       stock.diffPercent,
                        totalDiff:  stock.diff * stock.volume,
                        volume:     stock.volume,
                        totalWorth: stock.volume * stock.currentValue,
                        currency:   '$'
                    });
                }
            });
            this.dataSource = new MatTableDataSource<Element>(this.equities);
        });
    }

    ngOnInit() {
        this.equities         = [];
        this.displayedColumns = ['volume', 'symbol', 'value', 'diff', 'totalDiff', 'totalWorth' ];
        this.dataSource       = new MatTableDataSource<Element>(this.equities);
    }

    /**
     * Set the sort after the view init since this component will
     * be able to query its view for the initialized sort.
     */
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
}

export interface Element {
    symbol:     string;
    value:      number;
    diff:       number;
    totalDiff:  number;
    volume:     number;
    totalWorth: number;
    currency:   string;
}
