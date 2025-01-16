import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventosDiscotecasComponent } from './eventos-discotecas.component';

describe('EventosDiscotecasComponent', () => {
  let component: EventosDiscotecasComponent;
  let fixture: ComponentFixture<EventosDiscotecasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EventosDiscotecasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventosDiscotecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
