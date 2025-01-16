import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnyadirNoticiaMiDiscotecaComponent } from './anyadir-noticia-mi-discoteca.component';

describe('AnyadirNoticiaMiDiscotecaComponent', () => {
  let component: AnyadirNoticiaMiDiscotecaComponent;
  let fixture: ComponentFixture<AnyadirNoticiaMiDiscotecaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AnyadirNoticiaMiDiscotecaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnyadirNoticiaMiDiscotecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
