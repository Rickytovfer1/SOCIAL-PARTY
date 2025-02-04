import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerEventoInfoComponent } from './ver-evento-info.component';

describe('VerEventoInfoComponent', () => {
  let component: VerEventoInfoComponent;
  let fixture: ComponentFixture<VerEventoInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VerEventoInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerEventoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
