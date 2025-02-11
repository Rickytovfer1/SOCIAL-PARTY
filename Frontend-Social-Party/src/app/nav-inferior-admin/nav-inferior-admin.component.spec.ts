import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavInferiorAdminComponent } from './nav-inferior-admin.component';

describe('NavInferiorAdminComponent', () => {
  let component: NavInferiorAdminComponent;
  let fixture: ComponentFixture<NavInferiorAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavInferiorAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavInferiorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
