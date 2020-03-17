import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WlayoutComponent } from './wlayout.component';

describe('WlayoutComponent', () => {
  let component: WlayoutComponent;
  let fixture: ComponentFixture<WlayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WlayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
