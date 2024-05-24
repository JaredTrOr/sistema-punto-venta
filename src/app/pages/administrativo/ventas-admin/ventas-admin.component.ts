import { Component } from '@angular/core';
import { ventas } from '../../../utils/ventas';

@Component({
  selector: 'app-ventas-admin',
  templateUrl: './ventas-admin.component.html',
  styleUrl: './ventas-admin.component.css'
})
export class VentasAdminComponent {
  ventas = ventas;
}
