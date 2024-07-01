import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ElectronService } from '../../../services/electron.service';
import { Corte } from '../../../models/Corte';
import { Venta } from '../../../models/Ventas';
import { VentasPorProducto } from '../../../models/VentasPorProducto';

@Component({
  selector: 'app-cortes',
  templateUrl: './cortes.component.html',
  styleUrl: './cortes.component.css'
})
export class CortesComponent {

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
    this.electronService.on('get-cortes', (event, data) => {
      this.ngZone.run(() => {
        this.cortes = JSON.parse(data);
      })
    })
  }

  getVentasCorte(corte: Corte) {
    console.log('Corte seleccionado', corte)

    if (corte) {
      console.log('Si hay corte')
      this.electronService.send('get-ventas-por-corte', JSON.stringify(corte));
      this.electronService.on('get-ventas-por-corte', (event, data) => {
        this.ngZone.run(() => {
          this.ventas = JSON.parse(data);
          this.ordenarVentasPorProducto();
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
      this.electronService.on('get-cortes-por-fecha', (event, data) => {
        this.ngZone.run(() => {
          this.cortes = JSON.parse(data);
        });
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
