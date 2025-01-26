import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavInferiorComponent } from './nav-inferior.component';

describe('NavInferiorComponent', () => {
  let component: NavInferiorComponent;
  let fixture: ComponentFixture<NavInferiorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavInferiorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavInferiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
