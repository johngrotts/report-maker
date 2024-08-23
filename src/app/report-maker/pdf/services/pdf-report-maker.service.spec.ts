import { TestBed } from '@angular/core/testing';

import { PdfReportMakerService } from './pdf-report-maker.service';

describe('PdfReportMakerService', () => {
  let service: PdfReportMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfReportMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
