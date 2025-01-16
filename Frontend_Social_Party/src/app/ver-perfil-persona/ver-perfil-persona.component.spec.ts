import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerPerfilPersonaComponent } from './ver-perfil-persona.component';

describe('VerPerfilPersonaComponent', () => {
  let component: VerPerfilPersonaComponent;
  let fixture: ComponentFixture<VerPerfilPersonaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerPerfilPersonaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerPerfilPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
