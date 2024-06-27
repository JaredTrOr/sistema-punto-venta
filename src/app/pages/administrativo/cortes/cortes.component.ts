import { Component, NgZone } from '@angular/core';
import { ElectronService } from '../../../services/electron.service';
import { Corte } from '../../../models/Corte';

@Component({
  selector: 'app-cortes',
  templateUrl: './cortes.component.html',
  styleUrl: './cortes.component.css'
})
export class CortesComponent {

  cortes: Corte[] = [];

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


}
