import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavInferiorEmpresaComponent } from './nav-inferior-empresa.component';

describe('NavInferiorEmpresaComponent', () => {
  let component: NavInferiorEmpresaComponent;
  let fixture: ComponentFixture<NavInferiorEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavInferiorEmpresaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavInferiorEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
