import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserOccupationComponent } from './new-user-occupation.component';

describe('NewUserOccupationComponent', () => {
  let component: NewUserOccupationComponent;
  let fixture: ComponentFixture<NewUserOccupationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserOccupationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserOccupationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
