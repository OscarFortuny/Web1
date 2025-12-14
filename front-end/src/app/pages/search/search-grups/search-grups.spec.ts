import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGrups } from './search-grups';

describe('SearchGrups', () => {
  let component: SearchGrups;
  let fixture: ComponentFixture<SearchGrups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchGrups]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchGrups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
