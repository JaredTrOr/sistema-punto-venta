import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditarVentasComponent } from './admin-editar-ventas.component';

describe('AdminEditarVentasComponent', () => {
  let component: AdminEditarVentasComponent;
  let fixture: ComponentFixture<AdminEditarVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditarVentasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEditarVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
