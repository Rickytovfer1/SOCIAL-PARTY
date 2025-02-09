import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavSuperiorAdminComponent } from './nav-superior-admin.component';

describe('NavSuperiorAdminComponent', () => {
  let component: NavSuperiorAdminComponent;
  let fixture: ComponentFixture<NavSuperiorAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavSuperiorAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavSuperiorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
