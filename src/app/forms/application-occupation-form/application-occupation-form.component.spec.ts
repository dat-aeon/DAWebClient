import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationOccupationFormComponent } from './application-occupation-form.component';

describe('ApplicationOccupationFormComponent', () => {
  let component: ApplicationOccupationFormComponent;
  let fixture: ComponentFixture<ApplicationOccupationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationOccupationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationOccupationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
