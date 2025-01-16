import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuPrincipalGruposComponent } from './menu-principal-grupos.component';

describe('MenuPrincipalGruposComponent', () => {
  let component: MenuPrincipalGruposComponent;
  let fixture: ComponentFixture<MenuPrincipalGruposComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuPrincipalGruposComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPrincipalGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
