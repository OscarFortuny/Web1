import { TestBed } from '@angular/core/testing';

import { Universitats } from './universitats-service';

describe('Universitats', () => {
  let service: Universitats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Universitats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
