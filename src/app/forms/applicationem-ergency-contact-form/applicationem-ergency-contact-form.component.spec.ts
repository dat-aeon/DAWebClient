import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationemErgencyContactFormComponent } from './applicationem-ergency-contact-form.component';

describe('ApplicationemErgencyContactFormComponent', () => {
  let component: ApplicationemErgencyContactFormComponent;
  let fixture: ComponentFixture<ApplicationemErgencyContactFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationemErgencyContactFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationemErgencyContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
