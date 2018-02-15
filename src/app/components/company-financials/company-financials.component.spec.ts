import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFinancialsComponent } from './company-financials.component';

describe('CompanyFinancialsComponent', () => {
  let component: CompanyFinancialsComponent;
  let fixture: ComponentFixture<CompanyFinancialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFinancialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFinancialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
