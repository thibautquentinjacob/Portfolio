import { TestBed, inject } from '@angular/core/testing';

import { CompanyDataService } from './company-data.service';

describe('CompanyDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyDataService]
    });
  });

  it('should be created', inject([CompanyDataService], (service: CompanyDataService) => {
    expect(service).toBeTruthy();
  }));
});
