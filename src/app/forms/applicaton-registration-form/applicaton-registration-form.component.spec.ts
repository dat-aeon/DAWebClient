import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicatonRegistrationFormComponent } from './applicaton-registration-form.component';

describe('ApplicatonRegistrationFormComponent', () => {
  let component: ApplicatonRegistrationFormComponent;
  let fixture: ComponentFixture<ApplicatonRegistrationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicatonRegistrationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicatonRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
