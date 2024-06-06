import { Component, Input } from '@angular/core';
import { Venta } from '../../models/Ventas';

@Component({
  selector: 'app-ventas-general',
  templateUrl: './ventas-general.component.html',
  styleUrl: './ventas-general.component.css'
})
export class VentasGeneralComponent {

  @Input() ventas: Venta[] = [];

}
