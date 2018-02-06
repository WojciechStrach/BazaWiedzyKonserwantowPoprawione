import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreservativeSearchComponent } from './preservative-search.component';

describe('PreservativeSearchComponent', () => {
  let component: PreservativeSearchComponent;
  let fixture: ComponentFixture<PreservativeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreservativeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreservativeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
