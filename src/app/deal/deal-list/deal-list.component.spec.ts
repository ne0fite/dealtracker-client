import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealList } from './deal-list.component';

describe('DealListComponent', () => {
  let component: DealList;
  let fixture: ComponentFixture<DealList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
