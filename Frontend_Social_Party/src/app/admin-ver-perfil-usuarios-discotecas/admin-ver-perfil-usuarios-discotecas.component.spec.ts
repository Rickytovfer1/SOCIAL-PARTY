import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminVerPerfilUsuariosDiscotecasComponent } from './admin-ver-perfil-usuarios-discotecas.component';

describe('AdminVerPerfilUsuariosDiscotecasComponent', () => {
  let component: AdminVerPerfilUsuariosDiscotecasComponent;
  let fixture: ComponentFixture<AdminVerPerfilUsuariosDiscotecasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AdminVerPerfilUsuariosDiscotecasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminVerPerfilUsuariosDiscotecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
