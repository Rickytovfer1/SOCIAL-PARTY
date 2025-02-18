import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GestionAmigosComponent } from './gestion-amigos.component';

describe('GestionAmigosComponent', () => {
  let component: GestionAmigosComponent;
  let fixture: ComponentFixture<GestionAmigosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GestionAmigosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionAmigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
