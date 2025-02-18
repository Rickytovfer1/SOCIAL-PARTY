import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerEventosComponent } from './ver-eventos.component';

describe('VerEventosComponent', () => {
  let component: VerEventosComponent;
  let fixture: ComponentFixture<VerEventosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerEventosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
