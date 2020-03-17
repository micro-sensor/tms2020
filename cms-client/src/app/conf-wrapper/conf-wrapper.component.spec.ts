import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfWrapperComponent } from './conf-wrapper.component';

describe('ConfWrapperComponent', () => {
  let component: ConfWrapperComponent;
  let fixture: ComponentFixture<ConfWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
