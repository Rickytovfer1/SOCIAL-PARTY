import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditarEmpresaAdminComponent } from './editar-empresa-admin.component';

describe('EditarEmpresaAdminComponent', () => {
  let component: EditarEmpresaAdminComponent;
  let fixture: ComponentFixture<EditarEmpresaAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditarEmpresaAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEmpresaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
