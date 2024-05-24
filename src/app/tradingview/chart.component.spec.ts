import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingViewChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: TradingViewChartComponent;
  let fixture: ComponentFixture<TradingViewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingViewChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingViewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
