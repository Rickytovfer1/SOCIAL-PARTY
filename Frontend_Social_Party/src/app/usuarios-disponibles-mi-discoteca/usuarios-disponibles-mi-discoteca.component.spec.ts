import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsuariosDisponiblesMiDiscotecaComponent } from './usuarios-disponibles-mi-discoteca.component';

describe('UsuariosDisponiblesMiDiscotecaComponent', () => {
  let component: UsuariosDisponiblesMiDiscotecaComponent;
  let fixture: ComponentFixture<UsuariosDisponiblesMiDiscotecaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UsuariosDisponiblesMiDiscotecaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosDisponiblesMiDiscotecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
