import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarEmpleadosComponent } from './navbar-empleados.component';

describe('NavbarEmpleadosComponent', () => {
  let component: NavbarEmpleadosComponent;
  let fixture: ComponentFixture<NavbarEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarEmpleadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
