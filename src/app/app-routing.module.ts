import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { VentasComponent } from './pages/empleados/ventas/ventas.component';

import { ProductosComponent as AdminProductosComponent } from './pages/administrativo/productos/productos.component';
import { VentasAdminComponent } from './pages/administrativo/ventas-admin/ventas-admin.component';
import { EditarVentasComponent as AdminEditarVentasComponent } from './pages/administrativo/editar-ventas/editar-ventas.component';

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
    component: VentasAdminComponent
  },
  {
    path: 'admin-editar-ventas/:id',
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
