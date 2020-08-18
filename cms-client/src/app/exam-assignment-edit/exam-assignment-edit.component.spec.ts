import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAssignmentEditComponent } from './exam-assignment-edit.component';

describe('ExamAssignmentEditComponent', () => {
  let component: ExamAssignmentEditComponent;
  let fixture: ComponentFixture<ExamAssignmentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamAssignmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAssignmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
