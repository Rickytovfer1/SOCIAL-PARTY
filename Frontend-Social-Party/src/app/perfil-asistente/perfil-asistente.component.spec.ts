import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PerfilAsistenteComponent } from './perfil-asistente.component';

describe('PerfilAsistenteComponent', () => {
  let component: PerfilAsistenteComponent;
  let fixture: ComponentFixture<PerfilAsistenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PerfilAsistenteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilAsistenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
