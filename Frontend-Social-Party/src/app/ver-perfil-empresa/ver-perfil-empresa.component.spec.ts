import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerPerfilEmpresaComponent } from './ver-perfil-empresa.component';

describe('VerPerfilEmpresaComponent', () => {
  let component: VerPerfilEmpresaComponent;
  let fixture: ComponentFixture<VerPerfilEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerPerfilEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerPerfilEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
