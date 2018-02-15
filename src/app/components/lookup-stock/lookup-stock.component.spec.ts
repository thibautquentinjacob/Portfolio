import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupStockComponent } from './lookup-stock.component';

describe('LookupStockComponent', () => {
  let component: LookupStockComponent;
  let fixture: ComponentFixture<LookupStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
