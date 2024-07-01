import { Component, Input } from '@angular/core';
import { Venta } from '../../models/Ventas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas-general',
  templateUrl: './ventas-general.component.html',
  styleUrl: './ventas-general.component.css'
})
export class VentasGeneralComponent {

  @Input() ventas: Venta[] = [];
  @Input() origen!: string;

  constructor(private router: Router) {}

  irEditarVentas(idVenta: string) {
    const queryParams = {
      origen: this.origen,
      idVenta
    }

    this.router.navigate(['/admin-editar-ventas'],  { queryParams })

  }

}
