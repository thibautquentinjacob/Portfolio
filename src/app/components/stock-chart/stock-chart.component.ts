import { Component, OnInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { AfterViewInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { StockDataService } from '../../services/stock-data.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Stock } from '../../models/Stock';

@Component({
    selector: 'app-stock-chart',
    templateUrl: './stock-chart.component.html',
    styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnInit, AfterViewInit, OnDestroy {

    private chart: AmChart;
    chartData: any[] = [];
    divId            = 'stock-chart';
    stocks: Stock[];
    symbol: string;

    constructor( private AmCharts: AmChartsService,
                 private stockDataService: StockDataService,
                 private portfolioService: PortfolioService ) {
        portfolioService.loadedSymbolStream.subscribe( symbol => {
            this.symbol = symbol;
            this.updateChart();
        });
    }

    ngOnInit() {
        this.chartData = [];
        this.symbol    = 'MSFT';
    }

    updateChart() {
        this.stockDataService.getStockData( this.symbol ).subscribe( stocks => {
            this.stockDataService.computeSMA( 50, stocks, ( newStocks ) => {
                this.stockDataService.computeSMA( 15, stocks, ( newStocks ) => {
                    this.stockDataService.computeMcGinley( 15, stocks, ( newStocks ) => {
                        this.AmCharts.updateChart( this.chart, () => {
                            this.chart.dataProvider = newStocks;
                        });
                    });
                });
            });
        });
    }

    checkLoaded(): boolean {
        return document.querySelector( '#stock-chart .amcharts-main-div' ) !== null;
    }

    loadChart() {
        this.stockDataService.getStockData( this.symbol ).subscribe( stocks => {
            this.stockDataService.computeEMA( 50, stocks, ( newStocks ) => {
                this.stockDataService.computeEMA( 15, stocks, ( newStocks ) => {
                    this.stockDataService.computeMcGinley( 15, stocks, ( newStocks ) => {
                        console.log( newStocks );
                        this.chartData = newStocks;
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
                                    title: 'Open'
                                },
                                {
                                    id: 'v2',
                                    axisAlpha: 0,
                                    gridAlpha: 0,
                                    position: 'right',
                                    // title: 'Volume',
                                    strictMinMax: true,
                                    maximum: 355000000,
                                    labelsEnabled: false
                                },
                            ],
                            balloon: {
                                borderThickness: 1,
                                shadowAlpha: 0
                            },
                            graphs: [
                                {
                                    id: 'g1',
                                    proCandlesticks: true,
                                    // connect: true,
                                    balloonText: 'Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>',
                                    closeField: 'close',
                                    fillColors: '#7f8da9',
                                    highField: 'high',
                                    lineColor: '#5a6477',
                                    lineAlpha: 1,
                                    lowField: 'low',
                                    fillAlphas: 0.9,
                                    negativeFillColors: '#db4c3c',
                                    negativeLineColor: '#9d382d',
                                    openField: 'open',
                                    title: 'Price:',
                                    type: 'candlestick',
                                    valueField: 'open',
                                    // fillAlphas: 0.2,
                                    // bullet: 'round',
                                    // bulletBorderAlpha: 1,
                                    // bulletColor: '#FFFFFF',
                                    // bulletSize: 5,
                                    // hideBulletsCount: 50,
                                    // lineThickness: 2,
                                    // title: 'Open',
                                    // useLineColorForBulletBorder: true,
                                    // legendValueText: '[[value]]',
                                    // valueField: '1. open',
                                    // // balloonText: '[[value]]',
                                    valueAxis: 'v1'
                                },
                                {
                                    id: 'g2',
                                    fillAlphas: 0,
                                    lineAlpha: 0,
                                    // bullet: 'round',
                                    // bulletBorderAlpha: 0,
                                    // bulletColor: '#FFFFFF',
                                    // bulletSize: 5,
                                    lineThickness: 1,
                                    title: 'Volume',
                                    useLineColorForBulletBorder: true,
                                    type: 'column',
                                    legendValueText: '[[value]]',
                                    valueField: 'volume',
                                    balloonText: '[[value]]',
                                    // showBalloon: false,
                                    valueAxis: 'v2',
                                    fillColors: '#c0c0c0',
                                    highField: 'high',
                                    lineColor: '#888888',
                                },
                                {
                                    id: 'g3',
                                    balloonText: '[[value]]',
                                    fillColors: '#7f8da9',
                                    lineColor: '#F0F',
                                    lineAlpha: 1,
                                    fillAlphas: 0.,
                                    title: 'SMA 50:',
                                    valueField: 'SMA_50',
                                    valueAxis: 'v1',
                                    type: 'line'
                                },
                                {
                                    id: 'g4',
                                    balloonText: '[[value]]',
                                    fillColors: '#7f8da9',
                                    lineColor: '#8300FC',
                                    lineAlpha: 1,
                                    fillAlphas: 0.,
                                    title: 'SMA 15:',
                                    valueField: 'SMA_15',
                                    valueAxis: 'v1'
                                },
                                {
                                    id: 'g6',
                                    balloonText: '[[value]]',
                                    fillColors: '#7f8da9',
                                    lineColor: '#FF0',
                                    lineAlpha: 1,
                                    fillAlphas: 0.,
                                    title: 'EMA 50:',
                                    valueField: 'EMA_50',
                                    valueAxis: 'v1',
                                    type: 'line'
                                },
                                {
                                    id: 'g7',
                                    balloonText: '[[value]]',
                                    fillColors: '#7f8da9',
                                    lineColor: '#5F0',
                                    lineAlpha: 1,
                                    fillAlphas: 0.,
                                    title: 'EMA 15:',
                                    valueField: 'EMA_15',
                                    valueAxis: 'v1'
                                },
                                {
                                    id: 'g5',
                                    balloonText: '[[value]]',
                                    fillColors: '#7f8da9',
                                    lineColor: '#6B4600',
                                    lineAlpha: 1,
                                    fillAlphas: 0.,
                                    title: 'McGinley 15:',
                                    valueField: 'McGinley_15',
                                    valueAxis: 'v1'
                                }
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
                });
            });
            // Full day
            // this.chart.zoomToIndexes( this.chart.dataProvider.length - 390, this.chart.dataProvider.length - 1 );
            // Last hour
            // this.chart.zoomToIndexes( this.chart.dataProvider.length - 1, this.chart.dataProvider.length - 1 );
        });
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
