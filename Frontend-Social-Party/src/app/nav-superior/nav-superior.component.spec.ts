import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavSuperiorComponent } from './nav-superior.component';

describe('NavSuperiorComponent', () => {
  let component: NavSuperiorComponent;
  let fixture: ComponentFixture<NavSuperiorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavSuperiorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavSuperiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
