import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserLoanComponent } from './new-user-loan.component';

describe('NewUserLoanComponent', () => {
  let component: NewUserLoanComponent;
  let fixture: ComponentFixture<NewUserLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
