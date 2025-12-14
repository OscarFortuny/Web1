import { TestBed } from '@angular/core/testing';

import { Usuaris } from './usuaris';

describe('Usuaris', () => {
  let service: Usuaris;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Usuaris);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
