import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetalleNoticiaComponent } from './detalle-noticia.component';

describe('DetalleNoticiaComponent', () => {
  let component: DetalleNoticiaComponent;
  let fixture: ComponentFixture<DetalleNoticiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DetalleNoticiaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
