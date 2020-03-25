import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentEditComponent } from './attachment-edit.component';

describe('AttachmentEditComponent', () => {
  let component: AttachmentEditComponent;
  let fixture: ComponentFixture<AttachmentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
