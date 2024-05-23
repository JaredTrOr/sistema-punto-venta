import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { VentasComponent } from './pages/empleados/ventas/ventas.component';
import { AdminProductosComponent } from './pages/administrativo/admin-productos/admin-productos.component';
import { AdminVentasComponent } from './pages/administrativo/admin-ventas/admin-ventas.component';
import { AdminEditarVentasComponent } from './pages/administrativo/admin-editar-ventas/admin-editar-ventas.component';

const routes: Routes = [
  {
    path: 'inicio-sesion',
    title: 'Inicio de sesión',
    component: InicioSesionComponent
  },
  {
    path: 'ventas',
    title: 'Ventas',
    component: VentasComponent
  },
  {
    path: 'admin-productos',
    title: 'Administrar productos',
    component: AdminProductosComponent
  },
  {
    path: 'admin-ventas',
    title: 'Administrar ventas',
    component: AdminVentasComponent
  },
  {
    path: 'admin-editar-ventas',
    title: 'Editar ventas',
    component: AdminEditarVentasComponent
  },
  {
    path: '**',
    redirectTo: '/inicio-sesion'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
