import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAssignmentListComponent } from './exam-assignment-list.component';

describe('ExamAssignmentListComponent', () => {
  let component: ExamAssignmentListComponent;
  let fixture: ComponentFixture<ExamAssignmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamAssignmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
