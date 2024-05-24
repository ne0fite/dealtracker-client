import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { DealService } from './deal.service';

describe('DealService', () => {
  let service: DealService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClient]
    });
    service = TestBed.inject(DealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
