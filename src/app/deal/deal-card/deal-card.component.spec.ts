import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealCard } from './deal-card.component';

describe('DealCardComponent', () => {
  let component: DealCard;
  let fixture: ComponentFixture<DealCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
