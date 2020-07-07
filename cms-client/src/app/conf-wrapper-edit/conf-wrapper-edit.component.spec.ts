import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfWrapperEditComponent } from './conf-wrapper-edit.component';

describe('ConfWrapperEditComponent', () => {
  let component: ConfWrapperEditComponent;
  let fixture: ComponentFixture<ConfWrapperEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfWrapperEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfWrapperEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
