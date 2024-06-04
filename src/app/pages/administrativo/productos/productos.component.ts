import { Component } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../models/Producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  productos: Producto[] = [];
  busquedaTexto: string = '';
  categoriaSeleccionada: string = 'todos';
  categorias: string[] = [];

  nuevoProducto!: Producto;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.nuevoProducto = this.productosService.getNuevoProducto();
    this.productosService.getProductos().subscribe(data => {
      this.productos = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Producto,
          idFirebase: doc.payload.doc.id
        }
      });

      this.categorias = this.productos.map(producto => producto.categoria);
      this.categorias = [...new Set(this.categorias)];

    });
  }

  filtrarCategoria(): Producto[] {
    const productosFiltrados = this.productos.filter(producto => {
      return (
        (producto.descripcion.includes(this.busquedaTexto.toUpperCase())) &&
        (this.categoriaSeleccionada === 'todos' || producto.categoria === this.categoriaSeleccionada)
      );
    });

    return productosFiltrados;
  }
}
