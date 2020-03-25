import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetQuestionsComponent } from './reset-questions.component';

describe('ResetQuestionsComponent', () => {
  let component: ResetQuestionsComponent;
  let fixture: ComponentFixture<ResetQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
