import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUniversitats } from './search-universitats';

describe('SearchUniversitats', () => {
  let component: SearchUniversitats;
  let fixture: ComponentFixture<SearchUniversitats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchUniversitats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchUniversitats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
