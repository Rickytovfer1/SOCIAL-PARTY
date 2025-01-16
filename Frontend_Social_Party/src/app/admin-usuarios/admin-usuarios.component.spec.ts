import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminUsuariosComponent } from './admin-usuarios.component';

describe('AdminUsuariosComponent', () => {
  let component: AdminUsuariosComponent;
  let fixture: ComponentFixture<AdminUsuariosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AdminUsuariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
