import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealStats } from './deal-stats.component';

describe('DealStatsComponent', () => {
  let component: DealStats;
  let fixture: ComponentFixture<DealStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
