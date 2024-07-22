//Modulos de Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment.development';

//Componentes
import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { VentasComponent } from './pages/empleados/ventas/ventas.component';
import { NavbarEmpleadosComponent } from './components/navbar-empleados/navbar-empleados.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { ProductosComponent } from './pages/administrativo/productos/productos.component';
import { EditarVentasComponent } from './pages/administrativo/editar-ventas/editar-ventas.component';
import { VentasAdminComponent } from './pages/administrativo/ventas-admin/ventas-admin.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { VentasGeneralComponent } from './components/ventas-general/ventas-general.component';
import { VentasProductosComponent } from './components/ventas-productos/ventas-productos.component';
import { MostrarVentasComponent } from './pages/empleados/mostrar-ventas/mostrar-ventas.component';
import { VentasFiltrosComponent } from './pages/administrativo/ventas-filtros/ventas-filtros.component';
import { TestComponent } from './components/test/test.component';
import { EditarProductosComponent } from './pages/administrativo/editar-productos/editar-productos.component';
import { EditarCategoriasComponent } from './pages/administrativo/editar-categorias/editar-categorias.component';
import { CortesComponent } from './pages/administrativo/cortes/cortes.component';
import { CategoriasComponent } from './pages/administrativo/categorias/categorias.component';

//Servicios
import { GlobalService } from './services/global.service';
import { SeleccionarSucursalesComponent } from './pages/administrativo/seleccionar-sucursales/seleccionar-sucursales.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    VentasComponent,
    NavbarEmpleadosComponent,
    NavbarAdminComponent,
    ProductosComponent,
    EditarVentasComponent,
    VentasAdminComponent,
    VentasGeneralComponent,
    VentasProductosComponent,
    MostrarVentasComponent,
    VentasFiltrosComponent,
    TestComponent,
    EditarProductosComponent,
    CortesComponent,
    CategoriasComponent,
    EditarCategoriasComponent,
    SeleccionarSucursalesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
