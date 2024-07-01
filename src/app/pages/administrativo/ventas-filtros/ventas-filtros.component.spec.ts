import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasFiltrosComponent } from './ventas-filtros.component';

describe('VentasFiltrosComponent', () => {
  let component: VentasFiltrosComponent;
  let fixture: ComponentFixture<VentasFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasFiltrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
