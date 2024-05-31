import { Component } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { Venta } from '../../../models/Ventas';

@Component({
  selector: 'app-ventas-admin',
  templateUrl: './ventas-admin.component.html',
  styleUrl: './ventas-admin.component.css'
})
export class VentasAdminComponent {

  ventas: Venta[] = [];

  constructor(private ventasService: VentasService) { }

  ngOnInit(): void {
    this.ventasService.getVentas().subscribe(data => {
      this.ventas = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Venta,
          idVenta: doc.payload.doc.id
        }
      });

      //Escribir archivo JSON de los cambios en las venas
    })
  }

  
}
