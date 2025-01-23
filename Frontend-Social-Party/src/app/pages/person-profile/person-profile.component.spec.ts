import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonProfileComponent } from './person-profile.component';

describe('PersonProfileComponent', () => {
  let component: PersonProfileComponent;
  let fixture: ComponentFixture<PersonProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PersonProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
