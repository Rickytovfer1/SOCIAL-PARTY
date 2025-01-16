import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MenuPrincipalAmigosComponent } from './menu-principal-amigos.component';

describe('MenuPrincipalAmigosComponent', () => {
  let component: MenuPrincipalAmigosComponent;
  let fixture: ComponentFixture<MenuPrincipalAmigosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MenuPrincipalAmigosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuPrincipalAmigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
