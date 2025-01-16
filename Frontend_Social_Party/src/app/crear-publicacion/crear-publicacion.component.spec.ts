import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearPublicacionComponent } from './crear-publicacion.component';

describe('CrearPublicacionComponent', () => {
  let component: CrearPublicacionComponent;
  let fixture: ComponentFixture<CrearPublicacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearPublicacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
