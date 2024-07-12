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
  sucursales!: any;
  sucursalSeleccionada!: string;

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private globalService: GlobalService
  ) {
    this.setLoginForm();
  }

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
