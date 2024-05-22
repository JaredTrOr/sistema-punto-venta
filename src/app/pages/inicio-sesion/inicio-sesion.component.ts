import { Component } from '@angular/core';
import { Usuario } from '../../models/UsuarioEjemplo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {

  usuario!: Usuario;
  usuarios: Usuario[] = [];

  constructor(private router: Router) {
    this.usuarios = [
      {
        usuario: 'empleado',
        password: 'empleado'
      },
      {
        usuario: 'admin',
        password: 'admin'
      }
    ]
  }

  iniciarSesion() {
    this.router.navigate(['/ventas'])
  }

}
