import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossText } from './profit-loss-text.component';

describe('ProfitLossText', () => {
  let component: ProfitLossText;
  let fixture: ComponentFixture<ProfitLossText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitLossText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitLossText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
