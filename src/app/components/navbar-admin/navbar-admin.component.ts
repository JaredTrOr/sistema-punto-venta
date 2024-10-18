import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {

  isAccordionOpen = true;

  constructor(private router: Router) {}

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
