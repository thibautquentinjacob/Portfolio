import { Component, OnInit } from '@angular/core';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { AfterViewInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { StockDataService } from '../../services/stock-data.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
    selector: 'app-portfolio-chart',
    templateUrl: './portfolio-chart.component.html',
    styleUrls: ['./portfolio-chart.component.css']
})
export class PortfolioChartComponent implements OnInit, AfterViewInit, OnDestroy {

    private chart: AmChart;
    chartData: any[] = [];
    divId            = 'portfolio-chart';
    symbol: string;
    startIndex: number;
    endIndex:   number;

    constructor( private AmCharts: AmChartsService,
                 private stockDataService: StockDataService,
                 private portfolioService: PortfolioService ) {
        portfolioService.portfolioStream.subscribe( portfolio => {
            this.chartData = portfolio.history;
            this.AmCharts.updateChart( this.chart, () => {
                this.chart.dataProvider = this.chartData;
                this.chart.ignoreZoomed = true;
            });
        });
    }

    ngOnInit() {
        this.startIndex = null;
        this.endIndex   = null;
    }

    ngAfterViewInit() {
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
                }
            ],
            balloon: {
                borderThickness: 1,
                shadowAlpha: 0
            },
            graphs: [
                {
                    id: 'g2',
                    lineColor: '#070',
                    lineAlpha: 1,
                    fillColor: '#070',
                    fillAlphas: 0.2,
                    lineThickness: 1,
                    title: 'Total',
                    legendValueText: '[[value]]',
                    valueField: 'total',
                    balloonText: '[[value]]',
                    bullet: 'round',            /*ADDED THIS LINE*/
                    bulletSize: 1,
                    valueAxis: 'v2',
                    highField: 'high'
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
                selectedGraphFillColor: '#070',
                selectedGraphFillAlpha: 1,
                graphFillColor: '#070',
                graphFillAlpha: 0.5,
                selectedGraphLineColor: '#090',
                selectedGraphLineAlpha: 1,
                graphLineColor: '#090',
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
        const self = this;
        this.AmCharts.addListener( this.chart, 'zoomed', ( e ) => {
            if ( self.chart.ignoreZoomed ) {
                self.chart.ignoreZoomed = false;
                return;
            }
            self.startIndex = e.startIndex;
            self.endIndex   = e.endIndex;
        });

        this.AmCharts.addListener( this.chart, 'dataUpdated', ( e ) => {
            if ( self.startIndex != null && self.endIndex != null ) {
                self.chart.zoomToIndexes( self.startIndex, self.endIndex );
            }
        });
    }

    ngOnDestroy() {
        if ( this.chart ) {
            this.AmCharts.destroyChart( this.chart );
        }
    }
}
