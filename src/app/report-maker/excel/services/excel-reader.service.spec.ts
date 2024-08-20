import { TestBed } from '@angular/core/testing';

import { ExcelReaderService } from './excel-reader.service';

describe('ExcelReaderService', () => {
  let service: ExcelReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
