import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerEmpresaAdminComponent } from './ver-empresa-admin.component';

describe('VerEmpresaAdminComponent', () => {
  let component: VerEmpresaAdminComponent;
  let fixture: ComponentFixture<VerEmpresaAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerEmpresaAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerEmpresaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
