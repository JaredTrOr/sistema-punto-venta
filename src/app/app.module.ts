import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { InicioSesionComponent } from './pages/inicio-sesion/inicio-sesion.component';
import { VentasComponent } from './pages/empleados/ventas/ventas.component';
import { NavbarEmpleadosComponent } from './components/navbar-empleados/navbar-empleados.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    VentasComponent,
    NavbarEmpleadosComponent,
    NavbarAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
