import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUsuaris } from './search-usuaris';

describe('SearchUsuaris', () => {
  let component: SearchUsuaris;
  let fixture: ComponentFixture<SearchUsuaris>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUsuaris]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUsuaris);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
