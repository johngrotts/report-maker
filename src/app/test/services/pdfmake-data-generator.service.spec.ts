import { TestBed } from '@angular/core/testing';

import { PdfmakeDataGeneratorService } from './pdfmake-data-generator.service';

describe('PdfmakeDataGeneratorService', () => {
  let service: PdfmakeDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfmakeDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
