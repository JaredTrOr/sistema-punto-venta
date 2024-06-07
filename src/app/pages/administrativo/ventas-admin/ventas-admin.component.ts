import { ChangeDetectorRef, Component } from '@angular/core';
import { VentasService } from '../../../services/ventas.service';
import { Venta } from '../../../models/Ventas';
import { ElectronService } from '../../../services/electron.service';
import { Tiempo } from '../../../utils/tiempo';

@Component({
  selector: 'app-ventas-admin',
  templateUrl: './ventas-admin.component.html',
  styleUrl: './ventas-admin.component.css'
})
export class VentasAdminComponent {

  ventas: Venta[] = [];
  tiempo = new Tiempo();
  ventasProductos: string = 'ventasGeneral';

  constructor(
    private ventasService: VentasService,
    private electronService: ElectronService,
    private changeDetectorRef: ChangeDetectorRef
  ) { 
    
   }
    
  ngOnInit() {
    this.electronService.send('get-ventas', null);
    this.electronService.on('get-ventas', (event, ventas) => {
      const ventasParse = JSON.parse(ventas);
      console.log(ventasParse);
      this.ventas = ventasParse;
    });
  }

  realizarCorte() {
    //1.- Guardar en un archivo la fecha y hora de corte con los datos
    //2.- Cambiar de archivo para crear un nuevo archivo con los datos de la nueva venta (nuevo corte)
  }
}
