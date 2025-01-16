import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnyadirEventoMiDiscotecaComponent } from './anyadir-evento-mi-discoteca.component';

describe('AnyadirEventoMiDiscotecaComponent', () => {
  let component: AnyadirEventoMiDiscotecaComponent;
  let fixture: ComponentFixture<AnyadirEventoMiDiscotecaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AnyadirEventoMiDiscotecaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnyadirEventoMiDiscotecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
