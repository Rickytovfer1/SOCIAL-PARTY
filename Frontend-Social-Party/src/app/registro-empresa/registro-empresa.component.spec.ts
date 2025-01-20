import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegistroEmpresaComponent } from './registro-empresa.component';

describe('RegistroEmpresaComponent', () => {
  let component: RegistroEmpresaComponent;
  let fixture: ComponentFixture<RegistroEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RegistroEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
