import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationLoanFormComponent } from './application-loan-form.component';

describe('ApplicationLoanFormComponent', () => {
  let component: ApplicationLoanFormComponent;
  let fixture: ComponentFixture<ApplicationLoanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationLoanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationLoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
