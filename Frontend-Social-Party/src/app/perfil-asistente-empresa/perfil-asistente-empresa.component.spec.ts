import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerfilAsistenteEmpresaComponent } from './perfil-asistente-empresa.component';

describe('PerfilAsistenteEmpresaComponent', () => {
  let component: PerfilAsistenteEmpresaComponent;
  let fixture: ComponentFixture<PerfilAsistenteEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PerfilAsistenteEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilAsistenteEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
