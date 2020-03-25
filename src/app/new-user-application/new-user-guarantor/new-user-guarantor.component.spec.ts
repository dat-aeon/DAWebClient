import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserGuarantorComponent } from './new-user-guarantor.component';

describe('NewUserGuarantorComponent', () => {
  let component: NewUserGuarantorComponent;
  let fixture: ComponentFixture<NewUserGuarantorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserGuarantorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
