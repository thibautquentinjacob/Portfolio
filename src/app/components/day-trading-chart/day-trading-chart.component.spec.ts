import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTradingChartComponent } from './day-trading-chart.component';

describe('DayTradingChartComponent', () => {
  let component: DayTradingChartComponent;
  let fixture: ComponentFixture<DayTradingChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayTradingChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTradingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
