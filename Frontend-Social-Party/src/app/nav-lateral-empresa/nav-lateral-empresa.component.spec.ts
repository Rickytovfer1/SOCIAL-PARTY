import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavLateralEmpresaComponent } from './nav-lateral-empresa.component';

describe('NavLateralEmpresaComponent', () => {
  let component: NavLateralEmpresaComponent;
  let fixture: ComponentFixture<NavLateralEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavLateralEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavLateralEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
