import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfCreatorComponent } from './conf-creator.component';

describe('ConfCreatorComponent', () => {
  let component: ConfCreatorComponent;
  let fixture: ComponentFixture<ConfCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
