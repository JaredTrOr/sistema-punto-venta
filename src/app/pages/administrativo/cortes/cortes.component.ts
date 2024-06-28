import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ElectronService } from '../../../services/electron.service';
import { Corte } from '../../../models/Corte';
import { Venta } from '../../../models/Ventas';

@Component({
  selector: 'app-cortes',
  templateUrl: './cortes.component.html',
  styleUrl: './cortes.component.css'
})
export class CortesComponent {

  ventasProductos: string = 'ventasGeneral';
  cortes: Corte[] = [];
  ventas: Venta[] = [];

  corteSeleccionado: any = null;

  constructor(
    private electronService: ElectronService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
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
        })
      });
    }
    else {
      console.log('No hay corte')
      this.ventas = [];
    }
  }

  filtrarPorFecha(event: Event) {
    const fecha = event.target as HTMLInputElement;

    if (fecha.value) {
      const [anio, mes, dia] = fecha.value.split('-');
      const fechaValue = `${dia}/${mes}/${anio}`;
      this.electronService.send('get-cortes-por-fecha', fechaValue);
      this.electronService.on('get-cortes-por-fecha', (event, data) => {
        console.log(data);
        this.cortes = JSON.parse(data)
      })
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
