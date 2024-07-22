import { Component, NgZone } from '@angular/core';
import { ElectronService } from '../../../services/electron.service';
import { GlobalService } from '../../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seleccionar-sucursales',
  templateUrl: './seleccionar-sucursales.component.html',
  styleUrl: './seleccionar-sucursales.component.css'
})
export class SeleccionarSucursalesComponent {

  sucursales!: any;
  sucursalSeleccionada!: string;

  constructor(
    private electronService: ElectronService,
    private globalService: GlobalService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
     //Cargar las sucursales y tomar la sucursal seleccionada
     this.electronService.send('get-sucursales', null);
     this.electronService.on('get-sucursales', (event, response) => {
 
       this.ngZone.run(() => {
         const dataSucursales = JSON.parse(response);
         console.log(dataSucursales);
 
         if (dataSucursales.success) {
           this.sucursalSeleccionada = dataSucursales.sucursalSeleccionada;
           this.sucursales = dataSucursales.sucursales;
           this.globalService.setSucursal(this.sucursalSeleccionada);
 
         }
         else {
           Swal.fire('Error', 'Hubo un error al obtener las categorias', 'error');
         }
       })
 
     });
  }

  cambiarSucursal() {
    this.electronService.send('update-sucursal-seleccionada', this.sucursalSeleccionada);
    this.electronService.on('update-sucursal-seleccionada', (event, response) => {
      response = JSON.parse(response);
      if (response.success) {
        this.globalService.setSucursal(this.sucursalSeleccionada);
        Swal.fire('Cambio de sucursal', 'Se ha realizado el cambio de sucursal exitosamente', 'success');
      }
      else {
        Swal.fire('Error ', 'Hubo un error al realizar el cambio de la sucursal', 'error');
      }
    });
  }

}

