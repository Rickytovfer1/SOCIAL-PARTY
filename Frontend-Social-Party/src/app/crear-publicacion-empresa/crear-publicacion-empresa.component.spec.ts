import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearPublicacionEmpresaComponent } from './crear-publicacion-empresa.component';

describe('CrearPublicacionEmpresaComponent', () => {
  let component: CrearPublicacionEmpresaComponent;
  let fixture: ComponentFixture<CrearPublicacionEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearPublicacionEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPublicacionEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
