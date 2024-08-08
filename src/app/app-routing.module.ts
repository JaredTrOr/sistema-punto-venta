import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { VentasComponent } from './pages/empleados/ventas/ventas.component';

import { ProductosComponent as AdminProductosComponent } from './pages/administrativo/productos/productos.component';
import { VentasAdminComponent } from './pages/administrativo/ventas-admin/ventas-admin.component';
import { EditarVentasComponent as AdminEditarVentasComponent } from './pages/administrativo/editar-ventas/editar-ventas.component';
import { MostrarVentasComponent } from './pages/empleados/mostrar-ventas/mostrar-ventas.component';
import { VentasFiltrosComponent } from './pages/administrativo/ventas-filtros/ventas-filtros.component';
import { TestComponent } from './components/test/test.component';
import { EditarProductosComponent } from './pages/administrativo/editar-productos/editar-productos.component';
import { CortesComponent } from './pages/administrativo/cortes/cortes.component';
import { CategoriasComponent } from './pages/administrativo/categorias/categorias.component';
import { EditarCategoriasComponent } from './pages/administrativo/editar-categorias/editar-categorias.component';
import { SeleccionarSucursalesComponent } from './pages/administrativo/seleccionar-sucursales/seleccionar-sucursales.component';

const routes: Routes = [

  //Pantalla accessible por todos 
  {
    path: 'inicio-sesion',
    title: 'Inicio de sesión',
    component: InicioSesionComponent
  },

  //Pantallas de empleados 
  {
    path: 'ventas',
    title: 'Ventas',
    component: VentasComponent
  },
  {
    path: 'mostrar-ventas',
    title: 'Mostrar ventas',
    component: MostrarVentasComponent
  },

  //Pantalla administrador
  {
    path: 'admin-productos',
    title: 'Administrar productos',
    component: AdminProductosComponent
  },
  {
    path: 'editar-productos/:id',
    title: 'Editar productos',
    component: EditarProductosComponent
  },
  {
    path: 'admin-ventas',
    title: 'Administrar ventas',
    component: VentasAdminComponent
  },
  {
    path: 'admin-ventas-filtros',
    title: 'Filtros de ventas',
    component: VentasFiltrosComponent
  },
  {
    path: 'admin-editar-ventas',
    title: 'Editar ventas',
    component: AdminEditarVentasComponent
  },
  {
    path: 'cortes',
    title: 'Cortes',
    component: CortesComponent
  },
  {
    path: 'categorias',
    title: 'Categorias',
    component: CategoriasComponent
  },
  {
    path: 'editar-categorias/:id',
    title: 'Editar categorias',
    component: EditarCategoriasComponent
  },
  {
    path: 'seleccionar-sucursal',
    title: 'Seleccionar sucursal',
    component: SeleccionarSucursalesComponent
  },

  //Pantalla de prueba
  {
    path: 'test',
    component: TestComponent
  },

  //Redirección default
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
