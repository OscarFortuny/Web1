import { TestBed } from '@angular/core/testing';

import { Grups } from './grups';

describe('Grups', () => {
  let service: Grups;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Grups);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
