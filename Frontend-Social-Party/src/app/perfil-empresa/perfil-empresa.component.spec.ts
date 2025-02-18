import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerfilEmpresaComponent } from './perfil-empresa.component';

describe('PerfilEmpresaComponent', () => {
  let component: PerfilEmpresaComponent;
  let fixture: ComponentFixture<PerfilEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PerfilEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
