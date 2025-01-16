import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminLocalesComponent } from './admin-locales.component';

describe('AdminLocalesComponent', () => {
  let component: AdminLocalesComponent;
  let fixture: ComponentFixture<AdminLocalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AdminLocalesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLocalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
