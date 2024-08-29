import { TestBed } from '@angular/core/testing';

import { BaseDataGenerationService } from './base-data-generation.service';

describe('BaseDataGenerationService', () => {
  let service: BaseDataGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseDataGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
