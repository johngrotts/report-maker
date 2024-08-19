import { TestBed } from '@angular/core/testing';

import { ExcelReportMakerService } from './excel-report-maker.service';

describe('ExcelReportMakerService', () => {
  let service: ExcelReportMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelReportMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
