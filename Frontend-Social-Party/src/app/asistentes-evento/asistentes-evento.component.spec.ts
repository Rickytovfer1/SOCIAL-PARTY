import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AsistentesEventoComponent } from './asistentes-evento.component';

describe('AsistentesEventoComponent', () => {
  let component: AsistentesEventoComponent;
  let fixture: ComponentFixture<AsistentesEventoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AsistentesEventoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsistentesEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
