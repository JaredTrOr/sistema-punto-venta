import { ChangeDetectorRef, Component } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { Venta } from '../../../models/Ventas';
import { ElectronService } from '../../../services/electron.service';
import { Tiempo } from '../../../utils/tiempo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-admin',
  templateUrl: './ventas-admin.component.html',
  styleUrl: './ventas-admin.component.css'
})
export class VentasAdminComponent {

  ventas: Venta[] = [];
  tiempo = new Tiempo();
  ventasProductos: string = 'ventasGeneral';

  ventasDespuesCorte: Venta[] = [];

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
    });
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
        this.electronService.send('create-corte', tituloCorte);
        this.electronService.on('create-corte', (event, corte) => {
          if (corte.success) {
            this.getVentasDespuesCorte() //--> Refrescar componentes

            Swal.fire("El corte se ha realizado con éxito", "", "success");

          }
        })

      }
    });

  }

  exportarPDF() {
    
  }
}
