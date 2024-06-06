import { Component, Input } from '@angular/core';
import { Venta } from '../../models/Ventas';


interface VentasPorProducto {
  nombreProducto: string;
  cantidad: number;
  importe: number;
  total: number;
}

@Component({
  selector: 'app-ventas-productos',
  templateUrl: './ventas-productos.component.html',
  styleUrl: './ventas-productos.component.css'
})
export class VentasProductosComponent {
  @Input() ventas: Venta[] = [];

  ventasPorProductoAux: VentasPorProducto[] = [];
  ventasPorProducto: VentasPorProducto[] = [];

  ngOnInit() {
    this.ventas.forEach(venta => {
      this.ventasPorProductoAux = this.ventasPorProductoAux.concat(venta.productos);
    })

   this.ventasPorProductoAux.forEach(producto => {
    const productoEnArreglo = this.ventasPorProducto.find(p => p.nombreProducto === producto.nombreProducto);

    if (productoEnArreglo) {
      productoEnArreglo.cantidad += producto.cantidad;
      productoEnArreglo.total = productoEnArreglo.cantidad * productoEnArreglo.importe;
    }
    else {
      this.ventasPorProducto.push({...producto});
    }
   })


  }
}
