import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BanearUsuarioComponent } from './banear-usuario.component';

describe('BanearUsuarioComponent', () => {
  let component: BanearUsuarioComponent;
  let fixture: ComponentFixture<BanearUsuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BanearUsuarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BanearUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
