import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AsistentesEventoEmpresaComponent } from './asistentes-evento-empresa.component';

describe('AsistentesEventoEmpresaComponent', () => {
  let component: AsistentesEventoEmpresaComponent;
  let fixture: ComponentFixture<AsistentesEventoEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AsistentesEventoEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsistentesEventoEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
