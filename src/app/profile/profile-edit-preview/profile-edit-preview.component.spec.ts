import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditPreviewComponent } from './profile-edit-preview.component';

describe('ProfileEditPreviewComponent', () => {
  let component: ProfileEditPreviewComponent;
  let fixture: ComponentFixture<ProfileEditPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEditPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
