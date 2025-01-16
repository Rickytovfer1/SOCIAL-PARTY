import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerPerfilUsuarioMiDiscotecaComponent } from './ver-perfil-usuario-mi-discoteca.component';

describe('VerPerfilUsuarioMiDiscotecaComponent', () => {
  let component: VerPerfilUsuarioMiDiscotecaComponent;
  let fixture: ComponentFixture<VerPerfilUsuarioMiDiscotecaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerPerfilUsuarioMiDiscotecaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerPerfilUsuarioMiDiscotecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
