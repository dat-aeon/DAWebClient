import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionChangeComponent } from './security-question-change.component';

describe('SecurityQuestionChangeComponent', () => {
  let component: SecurityQuestionChangeComponent;
  let fixture: ComponentFixture<SecurityQuestionChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityQuestionChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
