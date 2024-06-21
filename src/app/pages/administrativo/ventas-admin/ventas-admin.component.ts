import { ChangeDetectorRef, Component } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { Venta } from '../../../models/Ventas';
import { ElectronService } from '../../../services/electron.service';
import { Tiempo } from '../../../utils/tiempo';
import Swal from 'sweetalert2';
import { VentasPorProducto } from '../../../models/VentasPorProducto';
import { generarId } from '../../../utils/generadorId';

@Component({
  selector: 'app-ventas-admin',
  templateUrl: './ventas-admin.component.html',
  styleUrl: './ventas-admin.component.css'
})
export class VentasAdminComponent {

  ventas: Venta[] = []; // --> Ventas generales

  tiempo = new Tiempo();
  ventasProductos: string = 'ventasGeneral';

  ventasDespuesCorte: Venta[] = [];
  ventasPorProducto: VentasPorProducto[] = [];

  constructor(
    private ventasService: VentasService,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
    
   }
    
  ngOnInit() {

    //Obtener todas las ventas por día
    // Estas ventas se despliegan en la sección de ventas generales
    // this.getVentasGeneral();

    //Obtener las ventas despues de corte
    // Estas ventas se despliegan en la sección de ventas por producto ya que aqui muestra la tabla de productos vendidos
    this.getVentasDespuesCorte();
  }
 
  getVentasGeneral() {
    this.electronService.send('get-ventas', null);
    this.electronService.on('get-ventas', (event, ventas) => {
      this.ventas = JSON.parse(ventas);
      this.changeDetectorRef.detectChanges();
    });
  }

  getVentasDespuesCorte() {
    this.electronService.send('get-venta-despues-corte', null);
    this.electronService.on('get-venta-despues-corte', (event, ventas) => {
      this.ventasDespuesCorte = [];
      this.ventasDespuesCorte = JSON.parse(ventas);
      this.changeDetectorRef.detectChanges();

      // Ordenar ventas por producto
      this.ordenarVentasPorProducto();
    });
  }

  ordenarVentasPorProducto() {
    let ventasPorProductoAux: any[] = [];

    this.ventasDespuesCorte.forEach(venta => {
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

  realizarCorte() {

    Swal.fire({
      title: "¿Seguro que quieres realizar el corte de caja?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, realizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        const tituloCorte = `Corte de caja del día ${this.tiempo.getDate()} a las ${this.tiempo.getHora()}`
        const fechaCorte = this.tiempo.getDate();
        const horaCorte = this.tiempo.getHora();

        const data = {
          idVenta: generarId(), 
          tituloCorte,
          fechaCorte,
          horaCorte,
        }

        //Realizar corte de caja en la base de datos en la nube

        // Realizar corte de caja en la base de datos local
        this.electronService.send('create-corte', data);
        this.electronService.on('create-corte', (event, corte) => {
          if (corte.success) {
            this.getVentasDespuesCorte() //--> Refrescar componentes

            Swal.fire("El corte se ha realizado con éxito", "", "success");
            this.exportarPDF(`Corte de caja del día ${this.tiempo.getDate()} a las ${this.tiempo.getHora()}`);
          }
        })

      }
    });
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
