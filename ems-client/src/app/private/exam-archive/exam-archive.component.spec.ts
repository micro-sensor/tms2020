import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamArchiveComponent } from './exam-archive.component';

describe('ExamArchiveComponent', () => {
  let component: ExamArchiveComponent;
  let fixture: ComponentFixture<ExamArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
