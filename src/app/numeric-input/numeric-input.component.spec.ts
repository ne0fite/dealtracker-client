import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericInput } from './numeric-input.component';

describe('NumericInputComponent', () => {
  let component: NumericInput;
  let fixture: ComponentFixture<NumericInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
