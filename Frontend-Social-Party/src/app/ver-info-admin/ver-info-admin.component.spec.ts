import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerInfoAdminComponent } from './ver-info-admin.component';

describe('VerInfoAdminComponent', () => {
  let component: VerInfoAdminComponent;
  let fixture: ComponentFixture<VerInfoAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerInfoAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerInfoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
