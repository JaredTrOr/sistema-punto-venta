import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {

  usuario = { usuario: '', password: ''};

  constructor(
    private router: Router, 
    private electronService: ElectronService,
    private ngZone: NgZone
  ) { }

  iniciarSesion() {

    this.electronService.send('iniciar-sesion', this.usuario);
    this.electronService.on('iniciar-sesion', (event, response) => {
      response = JSON.parse(response);
      if (response.success) {
        this.ngZone.run(() => {
          this.router.navigateByUrl(response.ruta);
        })  
      }
      else {
        Swal.fire('Error', response.message, 'error');
      }
    });
  }

}
