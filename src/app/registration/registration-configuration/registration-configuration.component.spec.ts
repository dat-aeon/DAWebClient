import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationConfigurationComponent } from './registration-configuration.component';

describe('RegistrationConfigurationComponent', () => {
  let component: RegistrationConfigurationComponent;
  let fixture: ComponentFixture<RegistrationConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
