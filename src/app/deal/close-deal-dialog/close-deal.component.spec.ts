import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseDealDialog } from './close-deal-dialog.component';

describe('CloseDealComponent', () => {
  let component: CloseDealDialog;
  let fixture: ComponentFixture<CloseDealDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseDealDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseDealDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
