import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerEntradasComponent } from './ver-entradas.component';

describe('VerEntradasComponent', () => {
  let component: VerEntradasComponent;
  let fixture: ComponentFixture<VerEntradasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerEntradasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
