import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InqueryComponent } from './inquery.component';

describe('InqueryComponent', () => {
  let component: InqueryComponent;
  let fixture: ComponentFixture<InqueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InqueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
