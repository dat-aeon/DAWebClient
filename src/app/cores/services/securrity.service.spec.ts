import { TestBed } from '@angular/core/testing';

import { SecurrityService } from './securrity.service';

describe('SecurrityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecurrityService = TestBed.get(SecurrityService);
    expect(service).toBeTruthy();
  });
});
