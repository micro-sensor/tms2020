import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamNavigationComponent } from './exam-navigation.component';

describe('ExamNavigationComponent', () => {
  let component: ExamNavigationComponent;
  let fixture: ComponentFixture<ExamNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
