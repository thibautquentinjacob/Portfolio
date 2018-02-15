import { Component } from '@angular/core';
import { Equity } from './models/Equity';
import { HttpClient } from '@angular/common/http';
import { SummaryBarComponent } from './components/summary-bar/summary-bar.component';
import { EquitiesBarComponent } from './components/equities-bar/equities-bar.component';
import { PortfolioContentComponent } from './components/portfolio-content/portfolio-content.component';
import { AboutCompanyComponent } from './components/about-company/about-company.component';
import { CompanyNewsComponent } from './components/company-news/company-news.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    tabChanged( event ) {
        console.log( 'tab changed', event );
    }
}

// equity: Equity = new Equity( 'FB' );
