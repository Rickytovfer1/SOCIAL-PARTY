import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanjearEntradaEmpresaComponent } from './canjear-entrada-empresa.component';

describe('CanjearEntradaEmpresaComponent', () => {
  let component: CanjearEntradaEmpresaComponent;
  let fixture: ComponentFixture<CanjearEntradaEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CanjearEntradaEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CanjearEntradaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
