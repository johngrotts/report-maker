import { TestBed } from '@angular/core/testing';

import { JsonObjectManagementService } from './json-object-management.service';

describe('JsonObjectManagementService', () => {
  let service: JsonObjectManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonObjectManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
