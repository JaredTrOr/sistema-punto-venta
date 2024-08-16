import { Component, NgZone } from '@angular/core';
import { ElectronService } from '../../../services/electron.service';
import { Corte } from '../../../models/Corte';
import { Venta } from '../../../models/Ventas';
import { VentasPorProducto } from '../../../models/VentasPorProducto';
import { Tiempo } from '../../../utils/tiempo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cortes',
  templateUrl: './cortes.component.html',
  styleUrl: './cortes.component.css'
})
export class CortesComponent {

  tiempo: Tiempo = new Tiempo();
  ventasProductos: string = 'ventasGeneral';
  filtroFecha = '';
  cortes: Corte[] = [];
  ventas: Venta[] = [];
  ventasPorProducto: VentasPorProducto[] = [];

  corteSeleccionado: any = null;

  constructor(
    private electronService: ElectronService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.getCortesGeneral();
  }

  getCortesGeneral() {
    this.electronService.send('get-cortes', null);
    this.electronService.on('get-cortes', (event, response) => {

      response = JSON.parse(response);

      if (response.success) {
        this.ngZone.run(() => {

          const cortes = response.cortes
          
          cortes.forEach((elemento: any) => {
            elemento.tiempoInicio = new Date(elemento.tiempoInicio);
            elemento.tiempoFin = new Date(elemento.tiempoFin);
          })
  
          this.cortes = cortes;
        });

        return;
      }

      Swal.fire('Hubo un error al cargar los cortes', '', 'error');

    })
  }

  getVentasCorte(corte: Corte) {
    if (corte) {
      console.log('Si hay corte')
      this.electronService.send('get-ventas-por-corte', JSON.stringify(corte));
      this.electronService.on('get-ventas-por-corte', (event, response) => {
        this.ngZone.run(() => {

          response = JSON.parse(response);

          if (response.success) {
            this.ventas = response.ventas;
            this.ordenarVentasPorProducto();
            return;
          }
          
          Swal.fire("Hubo un error al obtener las ventas por corte", "", "error");
          
        })
      });
    }
    else {
      console.log('No hay corte')
      this.ventas = [];
      this.ventasPorProducto = [];
    }
  }

  ordenarVentasPorProducto() {
    let ventasPorProductoAux: any[] = [];
    this.ventasPorProducto = [];

    this.ventas.forEach(venta => {
      ventasPorProductoAux = ventasPorProductoAux.concat(venta.productos);
    })

    ventasPorProductoAux.forEach(producto => {
      const productoEnArreglo = this.ventasPorProducto.find(p => p.nombreProducto === producto.nombreProducto);

      if (productoEnArreglo) {
        productoEnArreglo.cantidad += producto.cantidad;
        productoEnArreglo.total = productoEnArreglo.cantidad * productoEnArreglo.importe;
      }
      else {
        this.ventasPorProducto.push({ ...producto });
      }
    })
  }

  filtrarPorFecha() {


    if (this.filtroFecha) {
      const [anio, mes, dia] = this.filtroFecha.split('-');
      const fechaValue = `${dia}/${mes}/${anio}`;
      console.log('Filtro fecha', fechaValue)
      this.electronService.send('get-cortes-por-fecha', fechaValue);
      this.electronService.on('get-cortes-por-fecha', (event, response) => {

        response = JSON.parse(response);

        if (response.success) {
          this.ngZone.run(() => {
            this.cortes = response.cortes;
          });

          return;
        }

        Swal.fire('Hubo un error al obtener los cortes por fecha', '', 'error');

      })
    }
    else {
      this.getCortesGeneral();
    }
    
  }

  toggleCorteSeleccionado(corte: any) {
    this.corteSeleccionado = corte === this.corteSeleccionado ? null : corte;
    this.getVentasCorte(this.corteSeleccionado);
  }

  isCardSeleccionada(corte: any) {
    return corte === this.corteSeleccionado;
  }


}
