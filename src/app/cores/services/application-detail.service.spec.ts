import { TestBed } from '@angular/core/testing';

import { ApplicationDetailService } from './application-detail.service';

describe('ApplicationDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationDetailService = TestBed.get(ApplicationDetailService);
    expect(service).toBeTruthy();
  });
});
