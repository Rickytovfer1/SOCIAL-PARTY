import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavSuperiorEmpresaComponent } from './nav-superior-empresa.component';

describe('NavSuperiorEmpresaComponent', () => {
  let component: NavSuperiorEmpresaComponent;
  let fixture: ComponentFixture<NavSuperiorEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavSuperiorEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavSuperiorEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
