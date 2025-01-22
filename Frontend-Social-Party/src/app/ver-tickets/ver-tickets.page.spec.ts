import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerTicketsPage } from './ver-tickets.page';

describe('VerTicketsPage', () => {
  let component: VerTicketsPage;
  let fixture: ComponentFixture<VerTicketsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerTicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
