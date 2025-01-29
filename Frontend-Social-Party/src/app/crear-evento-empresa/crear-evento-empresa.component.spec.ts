import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearEventoEmpresaComponent } from './crear-evento-empresa.component';

describe('CrearEventoEmpresaComponent', () => {
  let component: CrearEventoEmpresaComponent;
  let fixture: ComponentFixture<CrearEventoEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearEventoEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearEventoEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
