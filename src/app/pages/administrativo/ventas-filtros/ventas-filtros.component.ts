import { ChangeDetectorRef, Component } from '@angular/core';
import { Tiempo } from '../../../utils/tiempo';
import { ElectronService } from '../../../services/electron.service';
import { Venta } from '../../../models/Ventas';
import { VentasPorProducto } from '../../../models/VentasPorProducto';
import { VentasService } from '../../../services/ventas.service';

@Component({
  selector: 'app-ventas-filtros',
  templateUrl: './ventas-filtros.component.html',
  styleUrl: './ventas-filtros.component.css'
})
export class VentasFiltrosComponent {

  ventas: Venta[] = []; // --> Ventas generales
  ventasPorProducto: VentasPorProducto[] = [];

  tiempo = new Tiempo();
  ventasProductos: string = 'ventasGeneral';
  masFiltros: boolean = false;


  constructor(
    private ventasService: VentasService,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
    
   }
    
  ngOnInit() {

    //Obtener todas las ventas por día
    // Estas ventas se despliegan en la sección de ventas generales
    this.getVentasGeneral();

    //Obtener las ventas despues de corte
    // Estas ventas se despliegan en la sección de ventas por producto ya que aqui muestra la tabla de productos vendidos
    // this.getVentasDespuesCorte();
  }
 
  getVentasGeneral() {
    this.electronService.send('get-ventas', null);
    this.electronService.on('get-ventas', (event, ventas) => {
      this.ventas = JSON.parse(ventas);
      this.changeDetectorRef.detectChanges();

      this.ordenarVentasPorProducto();
    });
  }

  ordenarVentasPorProducto() {
    let ventasPorProductoAux: any[] = [];

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
      this.ventasPorProducto.push({...producto});
    }
   })
  }

  exportarPDF(tituloPDF: string) {
    const data = {
      tituloPDF,
      fecha: this.tiempo.getDate(),
      hora: this.tiempo.getHora(),
      ventas: this.ventasPorProducto,
    }
    this.electronService.send('exportar-pdf', data);
  }
}
