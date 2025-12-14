import { TestBed } from '@angular/core/testing';

import { UniversitatsService } from './universitats-service';

describe('UniversitatsService', () => {
  let service: UniversitatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniversitatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
