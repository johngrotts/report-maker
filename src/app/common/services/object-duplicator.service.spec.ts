import { TestBed } from '@angular/core/testing';

import { ObjectDuplicatorService } from './object-duplicator.service';

describe('ObjectDuplicatorService', () => {
  let service: ObjectDuplicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectDuplicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
