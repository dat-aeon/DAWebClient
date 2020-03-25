import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionChangePreviewComponent } from './security-question-change-preview.component';

describe('SecurityQuestionChangePreviewComponent', () => {
  let component: SecurityQuestionChangePreviewComponent;
  let fixture: ComponentFixture<SecurityQuestionChangePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityQuestionChangePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionChangePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
