import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditarClienteAdminComponent } from './editar-cliente-admin.component';

describe('EditarClienteAdminComponent', () => {
  let component: EditarClienteAdminComponent;
  let fixture: ComponentFixture<EditarClienteAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditarClienteAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarClienteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
