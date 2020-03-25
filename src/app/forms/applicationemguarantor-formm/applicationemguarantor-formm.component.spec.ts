import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationemguarantorFormmComponent } from './applicationemguarantor-formm.component';

describe('ApplicationemguarantorFormmComponent', () => {
  let component: ApplicationemguarantorFormmComponent;
  let fixture: ComponentFixture<ApplicationemguarantorFormmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationemguarantorFormmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationemguarantorFormmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
