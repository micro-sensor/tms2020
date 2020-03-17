import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAssignmentComponent } from './exam-assignment.component';

describe('ExamAssignmentComponent', () => {
  let component: ExamAssignmentComponent;
  let fixture: ComponentFixture<ExamAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
