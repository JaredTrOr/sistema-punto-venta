import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Venta } from '../../../models/Ventas';
import { ElectronService } from '../../../services/electron.service';
import { ProductoVenta } from '../../../models/ProductoVenta';
import Swal from 'sweetalert2';
import { VentasService } from '../../../services/ventas.service';

@Component({
  selector: 'app-editar-ventas',
  templateUrl: './editar-ventas.component.html',
  styleUrl: './editar-ventas.component.css'
})
export class EditarVentasComponent {

  origen!: string;
  ventas: Venta[] = [];
  ventaSeleccionada!: Venta;

  constructor(
    private route: ActivatedRoute,
    private electronService: ElectronService,
    private ventasService: VentasService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.origen = params['origen'];
      const idVenta = params['idVenta'];
      
      this.electronService.send('get-venta-por-id', idVenta);
      this.electronService.on('get-venta-por-id', (event, response) => {

        response = JSON.parse(response);

        if (response.success) {
          this.ngZone.run(() => {
            this.ventaSeleccionada = response.venta;
          });
        }

        else {
          Swal.fire('Hubo un error al obtener la venta por ID', '', 'error');
        }

      })
    });

  }

  eliminarProductoVenta(producto: ProductoVenta) {
    Swal.fire({
      title: "¿Seguro que quiere borrar el producto de la venta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, realizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.ventaSeleccionada.productos.indexOf(producto);
        this.ventaSeleccionada.productos.splice(index, 1);
        
      } 
    })
  }

  editarVenta() {
    Swal.fire({
      title: "¿Seguro que quiere editar la venta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, realizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        //Actualizar venta de manera local
        this.electronService.send('update-venta', this.ventaSeleccionada);
        this.electronService.on('update-venta', (event, response) => {
          response = JSON.parse(response);
          if (response.success) {
            this.ngZone.run(() => {
              Swal.fire("La venta se ha editado con éxito", "", "success");

              //Una vez realizada la edición redireccionar a la página de origen
              this.router.navigateByUrl(this.seleccionarRedireccionamiento());
            })
          }
          else {
            Swal.fire("Ocurrió un error al editar la venta", "", "error");
          }
        });

        //Actualizar venta en la base de datos de firebase
        this.ventasService.updateVentaByIdVenta(this.ventaSeleccionada.idVenta!, this.ventaSeleccionada)
        .subscribe(() => {
          console.log('Actualización exitosa en firebase')
        })

      }
    })

    
  }

  eliminarVenta() {
    Swal.fire({
      title: "¿Seguro que quiere eliminar la venta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, realizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        //Eliminar venta de la base de datos de firebase
        this.electronService.send('delete-venta', this.ventaSeleccionada.idVenta);
        this.electronService.on('delete-venta', (event, response) => {
          response = JSON.parse(response);
          if (response.success) {
            this.ngZone.run(() => {
              Swal.fire("La venta se ha eliminado con éxito", "", "success");
    
              //Una vez realizada la eliminación redireccionar a la página de origen
              this.router.navigateByUrl(this.seleccionarRedireccionamiento());
            })
          }
          else {
            Swal.fire("Hubo un error al eliminar la venta", "", "success");
          }
        });

        this.ventasService.deleteVentaByIdVenta(this.ventaSeleccionada.idVenta!)
        .subscribe(() => {
          console.log('Eliminación exitosa en firebase')
        })
      }
    })
  }

  calcularCantidadGeneral() {
    const cantidadGeneral = this.ventaSeleccionada.productos.reduce((acc, producto) => acc + producto.cantidad, 0);
    this.ventaSeleccionada.cantidadGeneral = cantidadGeneral;

    return cantidadGeneral;
  }

  calcularTotalGeneral() {
    this.ventaSeleccionada.productos.forEach(producto => producto.total = producto.importe * producto.cantidad);
    const totalGeneral = this.ventaSeleccionada.productos.reduce((totalGeneral, producto) => totalGeneral + producto.total, 0);
    this.ventaSeleccionada.totalGeneral = totalGeneral;
    return totalGeneral;
  }

  seleccionarRedireccionamiento() {
    let ruta = '';

    if (this.origen === 'empleado') {
      ruta = '/mostrar-ventas';
    } else if (this.origen === 'admin') {
      ruta = '/admin-ventas-filtros';
    }

    return ruta
  }

}
