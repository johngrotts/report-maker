import { TestBed } from '@angular/core/testing';

import { ValidationUtilsService } from './validation-utils.service';

describe('ValidationUtilsService', () => {
  let service: ValidationUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
