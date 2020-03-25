import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDataComponent } from './application-data.component';

describe('ApplicationDataComponent', () => {
  let component: ApplicationDataComponent;
  let fixture: ComponentFixture<ApplicationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
