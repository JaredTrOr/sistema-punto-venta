import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-empleados',
  templateUrl: './navbar-empleados.component.html',
  styleUrl: './navbar-empleados.component.css'
})
export class NavbarEmpleadosComponent {
  isAccordionOpen = true;

  constructor(private router: Router) {}

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
