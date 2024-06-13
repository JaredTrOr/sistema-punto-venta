import { Component } from '@angular/core';
import { Usuario } from '../../models/UsuarioEjemplo';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {

  usuario = { usuario: '', password: ''};
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

    console.log(this.usuario)

    if(this.usuario.usuario === 'admin' && this.usuario.password === 'admin') {
      this.router.navigate(['/admin-ventas-filtros']);
    } else if(this.usuario.usuario === 'empleado' && this.usuario.password === 'empleado') {
      this.router.navigate(['/ventas']);
    }
    else {
      Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
    }
  }

}
