import { ChangeDetectorRef, Component } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { Venta } from '../../../models/Ventas';
import { ElectronService } from '../../../services/electron.service';
import { Tiempo } from '../../../utils/tiempo';
import Swal from 'sweetalert2';
import { VentasPorProducto } from '../../../models/VentasPorProducto';
import { generarId } from '../../../utils/generadorId';
import { Corte } from '../../../models/Corte';
import { CortesService } from '../../../services/cortes.service';
import { GlobalService } from '../../../services/global.service';

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
    private cortesService: CortesService,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef,
    private globalService: GlobalService
  ) {

  }

  ngOnInit() {
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
    this.electronService.on('get-venta-despues-corte', (event, response) => {

      response = JSON.parse(response);

      if (response.success) {
        this.ventasDespuesCorte = [];
        this.ventasDespuesCorte = response.ventas;

        // Ordenar ventas por producto
        this.ordenarVentasPorProducto();
        this.changeDetectorRef.detectChanges();

        return;
      }

      Swal.fire('Hubo un error al obtener las ventas después del corte', '', 'error');

    });
  }

  ordenarVentasPorProducto() {
    let ventasPorProductoAux: any[] = [];
    this.ventasPorProducto = [];

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
        this.ventasPorProducto.push({ ...producto });
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
    }).then(async (result) => {
      if (result.isConfirmed) {

        const tituloCorte = `Corte de caja del día ${this.tiempo.getDate()} a las ${this.tiempo.getHora()}`
        const fechaCorte = this.tiempo.getDate();
        const horaCorte = this.tiempo.getHora();

        const corte: Corte = {
          idCorte: generarId(),
          sucursal: this.globalService.getSucursal(),
          tituloCorte,
          fechaCorte,
          horaCorte,
        }

        //Realizar corte de caja en la base de datos en la nube
        this.cortesService.createCorte(corte).then(() => console.log('Corte creado con firebase'));

        // Realizar corte de caja en la base de datos local
        this.electronService.send('create-corte', corte);
        this.electronService.on('create-corte', (event, corte) => {

          if (corte.success) {
            
            // Realizar la impresión de ticket de corte de venta
            this.electronService.send('get-ultimo-corte', null);
            this.electronService.on('get-ultimo-corte', (event, data) => {

              data = JSON.parse(data);
              console.log(data);

              if (data.success) {

                const corte = data.ultimoCorte;

                const dataImpresionTicket = {
                  fechaCorte,
                  horaCorte,
                  horaInicio: this.tiempo.getFormattedHour(new Date(corte.tiempoInicio)),
                  horaFin: this.tiempo.getFormattedHour(new Date(corte.tiempoFin)),
                  productos: this.ventasPorProducto
                };

                //Creación de ticket
                this.electronService.send('imprimir-ticket-corte', dataImpresionTicket)

                //Creación de pdf
                this.exportarPDF(`Corte de caja del día ${this.tiempo.getDate()} a las ${this.tiempo.getHora()}`);

                this.getVentasDespuesCorte(); //--> Refrescar componentes
                Swal.fire("El corte se ha realizado con éxito", "", "success");
              }


            });
          }
        });



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
