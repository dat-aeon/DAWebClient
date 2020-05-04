import { TestBed } from '@angular/core/testing';

import { ApplicationFormService } from './application-form.service';

describe('ApplicationFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationFormService = TestBed.get(ApplicationFormService);
    expect(service).toBeTruthy();
  });
});
