import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmacionPagoComponent } from './confirmacion-pago.component';

describe('ConfirmacionPagoComponent', () => {
  let component: ConfirmacionPagoComponent;
  let fixture: ComponentFixture<ConfirmacionPagoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmacionPagoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
