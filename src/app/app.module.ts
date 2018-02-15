import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule,
         MatToolbarRow, MatIconModule, MatButtonToggleModule, MatSliderModule,
         MatCardModule, MatFormFieldModule, MatInputModule, MatGridListModule,
         MatTabsModule, MatTab, MatTableModule, MatExpansionModule, MatSelectModule,
         MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule,
         MatAutocompleteModule,
         MatTooltipModule,
         MatSnackBarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SummaryBarComponent } from './components/summary-bar/summary-bar.component';
import { EquitiesBarComponent } from './components/equities-bar/equities-bar.component';
import { PortfolioContentComponent } from './components/portfolio-content/portfolio-content.component';
import { AboutCompanyComponent } from './components/about-company/about-company.component';
import { CompanyNewsComponent } from './components/company-news/company-news.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { StockDataService } from './services/stock-data.service';
import { PortfolioService } from './services/portfolio.service';
import { NewsService } from './services/news.service';
import { CompanyDataService } from './services/company-data.service';
import { LookupStockComponent } from './components/lookup-stock/lookup-stock.component';
import { StockStatsComponent } from './components/stock-stats/stock-stats.component';
import { CompanyFinancialsComponent } from './components/company-financials/company-financials.component';
import { MillionPipe } from './million.pipe';
import { BillionPipe } from './billion.pipe';
import { DecimalPipe } from '@angular/common';
import { PortfolioChartComponent } from './components/portfolio-chart/portfolio-chart.component';
import { DayTradingChartComponent } from './components/day-trading-chart/day-trading-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    SummaryBarComponent,
    EquitiesBarComponent,
    PortfolioContentComponent,
    AboutCompanyComponent,
    CompanyNewsComponent,
    OrderHistoryComponent,
    PlaceOrderComponent,
    StockChartComponent,
    LookupStockComponent,
    StockStatsComponent,
    CompanyFinancialsComponent,
    MillionPipe, BillionPipe, PortfolioChartComponent, DayTradingChartComponent
  ],
  imports: [
    BrowserModule, FormsModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule,
    MatButtonToggleModule, MatSliderModule, MatCardModule, MatFormFieldModule,
    MatInputModule, BrowserAnimationsModule, MatGridListModule, MatTabsModule,
    MatTableModule, MatExpansionModule, MatSelectModule, MatDatepickerModule,
    MatProgressSpinnerModule, MatAutocompleteModule, MatTooltipModule,
    MatSnackBarModule,
    MatNativeDateModule, AmChartsModule,
    HttpClientModule, ReactiveFormsModule
  ],
  providers: [StockDataService, PortfolioService, NewsService, CompanyDataService, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
