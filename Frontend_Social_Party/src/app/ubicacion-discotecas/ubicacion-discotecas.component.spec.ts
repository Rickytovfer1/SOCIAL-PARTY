import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UbicacionDiscotecasComponent } from './ubicacion-discotecas.component';

describe('UbicacionDiscotecasComponent', () => {
  let component: UbicacionDiscotecasComponent;
  let fixture: ComponentFixture<UbicacionDiscotecasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UbicacionDiscotecasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UbicacionDiscotecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
