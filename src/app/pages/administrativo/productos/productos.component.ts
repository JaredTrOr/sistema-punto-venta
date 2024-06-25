import { Component } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../models/Producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../../models/Categoria';
import { ElectronService } from '../../../services/electron.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  productos: Producto[] = [];
  busquedaTexto: string = '';
  categoriaSeleccionada: string = 'todos';
  categorias: Categoria[] = [];

  nuevoProducto!: Producto;
  productosForm!: FormGroup;

  constructor(
    private productosService: ProductosService,
    private electronService: ElectronService,
    private formBuilder: FormBuilder
  ) {
    this.setProductosForm();
  }

  setProductosForm() {
    this.productosForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', Validators.required],
      precioPromo: [''],
      precioMin: ['']
    });
  }
 
  get myForm() {
    return this.productosForm.controls
  }

  ngOnInit(): void {
    this.nuevoProducto = this.productosService.getNuevoProducto();
    this.productosService.getProductos().subscribe(data => {
      this.productos = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Producto,
          idFirebase: doc.payload.doc.id
        }
      });
    });

    //Obtener las categorias de manera local
    this.electronService.send('get-categorias', null);
    this.electronService.on('get-categorias', (event, data) => {
      this.categorias = JSON.parse(data);
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

  agregarProducto() {
    
  }
} 
