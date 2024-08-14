import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ElectronService } from '../../services/electron.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {

  loginForm!: FormGroup;
  enviado = false;

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private globalService: GlobalService,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
  ) {
    this.setLoginForm();
  }

  ngOnInit() { 
    this.electronService.send('get-sucursales', null);
    this.electronService.on('get-sucursales', (event, response) => {
      response = JSON.parse(response)

      if (response.success){ 
        this.globalService.setSucursal(response.sucursalSeleccionada);
      }
      else {
        console.log('Error al obtener la sucursal')
      }

    })
  }

  setLoginForm() {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get myForm() {
    return this.loginForm.controls;
  }

  iniciarSesion() {

    this.enviado = true;

    if (!this.loginForm.valid) return;

    this.electronService.send('iniciar-sesion', this.loginForm.value);
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
