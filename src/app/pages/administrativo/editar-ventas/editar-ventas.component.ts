import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ventas } from '../../../utils/ventas'

@Component({
  selector: 'app-editar-ventas',
  templateUrl: './editar-ventas.component.html',
  styleUrl: './editar-ventas.component.css'
})
export class EditarVentasComponent {

  idVenta!: number;
  ventas = ventas;
  ventaSeleccionada: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idVenta = Number(params['id']);
      this.ventaSeleccionada = this.ventas.find(venta => venta.idVenta === this.idVenta); 
    });


  }
}
