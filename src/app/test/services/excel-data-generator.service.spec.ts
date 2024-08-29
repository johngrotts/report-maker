import { TestBed } from '@angular/core/testing';

import { ExcelDataGeneratorService } from './excel-data-generator.service';

describe('ExcelDataGeneratorService', () => {
  let service: ExcelDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
