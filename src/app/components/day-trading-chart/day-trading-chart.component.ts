import { Component, OnInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { AfterViewInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { StockDataService } from '../../services/stock-data.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Stock } from '../../models/Stock';

@Component({
    selector: 'app-day-trading-chart',
    templateUrl: './day-trading-chart.component.html',
    styleUrls: ['./day-trading-chart.component.css']
})
export class DayTradingChartComponent implements OnInit, AfterViewInit, OnDestroy {

    private chart: AmChart;
    chartData: any[] = [];
    divId            = 'day-trading-chart';
    symbol: string;

    constructor( private AmCharts: AmChartsService,
        private stockDataService: StockDataService,
        private portfolioService: PortfolioService ) {
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.updateChart();
        });
        // Set up update interval to 30s
        setInterval( () => {
            this.updateChart();
        }, 5 * 1000 );
    }

    ngOnInit() {
        this.chartData = [];
        this.symbol    = 'MSFT';
    }

    updateChart() {
        this.stockDataService.getDayStockData( this.symbol ).subscribe( stocks => {
            console.log( stocks );
            if ( stocks.length > 0 ) {
                this.AmCharts.updateChart( this.chart, () => {
                    // this.chart.dataProvider = newStocks;
                    this.chart.dataProvider = stocks;
                });
            }
            // this.computeSMA( 50, stocks, ( newStocks ) => {
                // this.computeSMA( 15, stocks, ( newStocks ) => {
                    // this.computeMcGinley( 15, stocks, ( newStocks ) => {
        });
                // });
            // });
        // });
    }

    checkLoaded(): boolean {
        return document.querySelector( '#day-trading-chart .amcharts-main-div' ) !== null;
    }

    loadChart() {
        this.stockDataService.getDayStockData( this.symbol ).subscribe( stocks => {
            console.log( stocks );
            // this.computeSMA( 50, stocks, ( newStocks ) => {
                // this.computeSMA( 15, stocks, ( newStocks ) => {
                    // this.computeMcGinley( 15, stocks, ( newStocks ) => {
                        // console.log( newStocks );
                        // this.chartData = newStocks;
                        this.chartData = stocks;
                        this.chart = this.AmCharts.makeChart( this.divId, {
                            fontFamily: 'arial',
                            type: 'serial',
                            theme: 'light',
                            marginRight: 40,
                            marginLeft: 40,
                            autoMarginOffset: 20,
                            dataDateFormat: 'YYYY-MM-DD HH:NN:SS',
                            mouseWheelZoomEnabled: false,
                            legend: {
                                equalWidths: false,
                                useGraphSettings: true,
                                valueAlign: 'left',
                                valueWidth: 120
                            },
                            valueAxes: [
                                {
                                    id: 'v1',
                                    axisAlpha: 0.5,
                                    gridAlpha: 0.,
                                    position: 'left',
                                    title: '$'
                                },
                            ],
                            balloon: {
                                borderThickness: 1,
                                shadowAlpha: 0
                            },
                            graphs: [
                                {
                                    id: 'g1',
                                    // connect: true,
                                    balloonText: 'Open:<b>[[average]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b>',
                                    fillColors: '#7f8da9',
                                    lineColor: '#5a6477',
                                    lineAlpha: 1,
                                    fillAlphas: 0.1,
                                    title: 'Price:',
                                    valueField: 'average',
                                    // fillAlphas: 0.2,
                                    bullet: 'round',
                                    bulletBorderAlpha: 0.1,
                                    bulletAlpha: 0.1,
                                    // bulletColor: '#FFFFFF',
                                    bulletSize: 1,
                                    // hideBulletsCount: 50,
                                    // lineThickness: 2,
                                    // title: 'Open',
                                    // useLineColorForBulletBorder: true,
                                    // legendValueText: '[[value]]',
                                    // valueField: '1. open',
                                    // // balloonText: '[[value]]',
                                    valueAxis: 'v1'
                                },
                                // {
                                //     id: 'g2',
                                //     fillAlphas: 0,
                                //     lineAlpha: 0,
                                //     // bullet: 'round',
                                //     // bulletBorderAlpha: 0,
                                //     // bulletColor: '#FFFFFF',
                                //     // bulletSize: 5,
                                //     lineThickness: 1,
                                //     title: 'Volume',
                                //     useLineColorForBulletBorder: true,
                                //     type: 'column',
                                //     legendValueText: '[[value]]',
                                //     valueField: 'volume',
                                //     balloonText: '[[value]]',
                                //     // showBalloon: false,
                                //     valueAxis: 'v2',
                                //     fillColors: '#c0c0c0',
                                //     highField: 'high',
                                //     lineColor: '#888888',
                                // },
                                // {
                                //     id: 'g3',
                                //     balloonText: '[[value]]',
                                //     fillColors: '#7f8da9',
                                //     lineColor: '#F0F',
                                //     lineAlpha: 1,
                                //     fillAlphas: 0.,
                                //     title: 'SMA 50:',
                                //     valueField: 'SMA_50',
                                //     valueAxis: 'v1',
                                //     type: 'line'
                                // },
                                // {
                                //     id: 'g4',
                                //     balloonText: '[[value]]',
                                //     fillColors: '#7f8da9',
                                //     lineColor: '#8300FC',
                                //     lineAlpha: 1,
                                //     fillAlphas: 0.,
                                //     title: 'SMA 15:',
                                //     valueField: 'SMA_15',
                                //     valueAxis: 'v1'
                                // },
                                // {
                                //     id: 'g5',
                                //     balloonText: '[[value]]',
                                //     fillColors: '#7f8da9',
                                //     lineColor: '#6B4600',
                                //     lineAlpha: 1,
                                //     fillAlphas: 0.,
                                //     title: 'McGinley 15:',
                                //     valueField: 'McGinley_15',
                                //     valueAxis: 'v1'
                                // }
                            ],
                            chartCursor: {
                                categoryBalloonDateFormat: 'DD/MM/YYYY HH:NN',
                                cursorAlpha: 0.1,
                                cursorColor: '#000000',
                                categoryBalloonAlpha: 0.8,
                                fullWidth: true,
                                valueBalloonsEnabled: false,
                                zoomable: false,
                                pan: true,
                            },
                            chartScrollbar: {
                                autoGridCount: true,
                                graph: 'g2',
                                fillAlphas: 1,
                                lineAlpha: 1,
                                backgroundColor: '#fff',
                                selectedGraphFillColor: '#c0c0c0',
                                selectedGraphFillAlpha: 1,
                                graphFillColor: '#c0c0c0',
                                graphFillAlpha: 0.5,
                                selectedGraphLineColor: '#888888',
                                selectedGraphLineAlpha: 1,
                                graphLineColor: '#888888',
                                graphLineAlpha: 0.5,
                                lineThickness: 1,
                                scrollbarHeight: 40,
                                oppositeAxis: false,
                                offset: 10,
                                hideResizeGrips: true,
                                color: '#9d382d00',
                                dragIcon: 'dragIconRectSmallBlack',
                                dragIconHeight: 17,
                                dragIconWidth: 17
                            },
                            categoryField: 'date',
                            categoryAxis: {
                                parseDates: true,
                                minPeriod: 'mm',
                                dashLength: 1,
                                equalSpacing: true
                                // minorGridEnabled: true,
                            },
                            export: {
                                enabled: true
                            },
                            dataProvider: this.chartData
                        });
                    });
                // });
            // });
            // Full day
            // this.chart.zoomToIndexes( this.chart.dataProvider.length - 390, this.chart.dataProvider.length - 1 );
            // Last hour
            // this.chart.zoomToIndexes( this.chart.dataProvider.length - 1, this.chart.dataProvider.length - 1 );
        // });
    }

    ngAfterViewInit() {
        this.loadChart();
        setInterval( () => {
            if ( !this.checkLoaded()) {
                this.loadChart();
            }
        }, 5000 );
    }

    ngOnDestroy() {
        if ( this.chart ) {
            this.AmCharts.destroyChart( this.chart );
        }
    }
}
