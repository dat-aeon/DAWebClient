import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationDetailComponent } from './occupation-detail.component';

describe('OccupationDetailComponent', () => {
  let component: OccupationDetailComponent;
  let fixture: ComponentFixture<OccupationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
