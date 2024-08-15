import { Component, OnInit } from '@angular/core';
import { ProductosService } from './services/productos.service';
import { Producto } from './models/Producto';
import { ElectronService } from './services/electron.service';
import { CategoriasService } from './services/categorias.service';
import { Categoria } from './models/Categoria';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'sistema-punto-venta';
  productos: Producto[] = [];
  categorias: Categoria[] = [];

  constructor(
    private productoService: ProductosService,
    private categoriaService: CategoriasService,
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {

    // Checar si hay internet antes de obtener los datos
    if (navigator.onLine) {
      this.fetchFirebaseProductosToLocal();
      this.fetchFirebaseCategoriasToLocal();
    }

    else {
      // No hay conexión a internet
      console.log('No se cargaron los datos de firebase');
    }
  }

  fetchFirebaseProductosToLocal(): void {
    // Cargar datos de productos a local cuando se inicialize la aplicación
    this.productoService.getProductos().subscribe(data => {
      this.productos = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Producto
        };
      });

      //Insertar los registros de los productos a base de datos local
      this.electronService.send('load-productos', this.productos);
    });
  }

  fetchFirebaseCategoriasToLocal(): void {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Categoria
        };
      });

      //Insertar los registros de las categorias a base de datos local
      this.electronService.send('load-categorias', this.categorias);
    });
  }

  
}
