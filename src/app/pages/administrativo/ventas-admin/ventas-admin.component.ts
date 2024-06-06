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
    this.electronService.send('leer-ventas', this.tiempo.getDate());
    this.electronService.on('leer-ventas', (event, ventas: Venta[]) => {
      this.ventas = [];
      this.ventas = ventas;
      this.changeDetectorRef.detectChanges();
    });
  }
}
