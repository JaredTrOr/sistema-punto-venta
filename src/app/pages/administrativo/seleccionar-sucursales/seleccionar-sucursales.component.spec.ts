import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarSucursalesComponent } from './seleccionar-sucursales.component';

describe('SeleccionarSucursalesComponent', () => {
  let component: SeleccionarSucursalesComponent;
  let fixture: ComponentFixture<SeleccionarSucursalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeleccionarSucursalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeleccionarSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
