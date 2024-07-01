import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProductosComponent } from './ventas-productos.component';

describe('VentasProductosComponent', () => {
  let component: VentasProductosComponent;
  let fixture: ComponentFixture<VentasProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
