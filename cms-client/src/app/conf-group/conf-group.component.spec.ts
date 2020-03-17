import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfGroupComponent } from './conf-group.component';

describe('ConfGroupComponent', () => {
  let component: ConfGroupComponent;
  let fixture: ComponentFixture<ConfGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
