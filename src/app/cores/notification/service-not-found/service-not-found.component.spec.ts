import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNotFoundComponent } from './service-not-found.component';

describe('ServiceNotFoundComponent', () => {
  let component: ServiceNotFoundComponent;
  let fixture: ComponentFixture<ServiceNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
