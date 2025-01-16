import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsuariosDisponiblesDiscotecasComponent } from './usuarios-disponibles-discotecas.component';

describe('UsuariosDisponiblesDiscotecasComponent', () => {
  let component: UsuariosDisponiblesDiscotecasComponent;
  let fixture: ComponentFixture<UsuariosDisponiblesDiscotecasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UsuariosDisponiblesDiscotecasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosDisponiblesDiscotecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
