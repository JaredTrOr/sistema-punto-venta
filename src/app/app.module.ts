//Modulos de Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

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
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
