import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquitiesBarComponent } from './equities-bar.component';

describe('EquitiesBarComponent', () => {
  let component: EquitiesBarComponent;
  let fixture: ComponentFixture<EquitiesBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquitiesBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquitiesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
