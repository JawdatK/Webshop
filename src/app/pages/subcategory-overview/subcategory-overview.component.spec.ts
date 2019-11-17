import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryOverviewComponent } from './subcategory-overview.component';

describe('SubcategoryOverviewComponent', () => {
  let component: SubcategoryOverviewComponent;
  let fixture: ComponentFixture<SubcategoryOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoryOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
