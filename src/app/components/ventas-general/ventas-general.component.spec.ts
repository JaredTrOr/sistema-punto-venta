import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasGeneralComponent } from './ventas-general.component';

describe('VentasGeneralComponent', () => {
  let component: VentasGeneralComponent;
  let fixture: ComponentFixture<VentasGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasGeneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
