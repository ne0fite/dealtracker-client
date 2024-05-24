import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteInput } from './quote-input.component';

describe('QuoteInputComponent', () => {
  let component: QuoteInput;
  let fixture: ComponentFixture<QuoteInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
