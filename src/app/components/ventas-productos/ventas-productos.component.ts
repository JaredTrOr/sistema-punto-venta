import { Component, Input } from '@angular/core';
import { Venta } from '../../models/Ventas';
import { VentasPorProducto } from '../../models/VentasPorProducto';

@Component({
  selector: 'app-ventas-productos',
  templateUrl: './ventas-productos.component.html',
  styleUrl: './ventas-productos.component.css'
})
export class VentasProductosComponent {
  @Input() ventasPorProducto: VentasPorProducto[] = [];


  constructor(
  ) { }

  ngOnInit() { }

  getTotalVentas() {
    return this.ventasPorProducto.reduce((acc, producto) => acc + producto.total, 0);
  }
}
