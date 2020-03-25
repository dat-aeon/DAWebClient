import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserEmergencyComponent } from './new-user-emergency.component';

describe('NewUserEmergencyComponent', () => {
  let component: NewUserEmergencyComponent;
  let fixture: ComponentFixture<NewUserEmergencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserEmergencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserEmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
