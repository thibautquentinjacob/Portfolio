import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Order } from '../../models/Order';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

    displayedColumns: string[];
    dataSource:       MatTableDataSource<Order>;
    symbol:           string;
    orders:           Order[];

    constructor( private portfolioService: PortfolioService ) {
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.portfolioService.getOrders( this.symbol ).subscribe( orders => {
                console.log( orders );
                this.orders = orders;
                this.dataSource = new MatTableDataSource<Order>( orders );
            });
        });
    }


    ngOnInit() {
        this.symbol = 'MSFT';
        this.orders = [];
        this.dataSource = new MatTableDataSource<Order>( this.orders );
        this.displayedColumns = [
            'date', 'resolved', 'order', 'limit', 'duration', 'action', 'orderValue',
            'totalCost', 'resolvedAvgValue', 'volume'
        ];
        this.portfolioService.getOrders( this.symbol ).subscribe( orders => {
            console.log( orders );
            this.orders = orders;
            this.dataSource = new MatTableDataSource<Order>( this.orders );
        });
        this.portfolioService.orderStream.subscribe( orders => {
            this.orders = [];
            orders.map( order => {
                if ( order.symbol === this.symbol ) {
                    this.orders.push( order );
                }
            });
            console.log( this.orders );
            this.dataSource = new MatTableDataSource<Order>( this.orders );
        });
    }
}
