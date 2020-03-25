import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactDetailComponent } from './emergency-contact-detail.component';

describe('EmergencyContactDetailComponent', () => {
  let component: EmergencyContactDetailComponent;
  let fixture: ComponentFixture<EmergencyContactDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyContactDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
