import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreservativeAddComponent } from './preservative-add.component';

describe('PreservativeAddComponent', () => {
  let component: PreservativeAddComponent;
  let fixture: ComponentFixture<PreservativeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreservativeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreservativeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
