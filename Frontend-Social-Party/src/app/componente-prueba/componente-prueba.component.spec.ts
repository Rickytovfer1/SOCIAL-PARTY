import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentePruebaComponent } from './componente-prueba.component';

describe('ComponentePruebaComponent', () => {
  let component: ComponentePruebaComponent;
  let fixture: ComponentFixture<ComponentePruebaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ComponentePruebaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentePruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
