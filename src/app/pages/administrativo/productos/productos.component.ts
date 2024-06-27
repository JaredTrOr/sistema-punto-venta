import { Component } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../models/Producto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../../models/Categoria';
import { ElectronService } from '../../../services/electron.service';
import { generarId } from '../../../utils/generadorId';
import Swal from 'sweetalert2';

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
  enviado = false;

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
      precio: ['', [Validators.required ,Validators.pattern('^[0-9]+')]],
      precioPromo: ['', Validators.pattern('^[0-9]+')],
      precioMin: ['', Validators.pattern('^[0-9]+')]
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
      producto.descripcion.toUpperCase();
      return (
        (producto.descripcion.includes(this.busquedaTexto.toUpperCase())) &&
        (this.categoriaSeleccionada === 'todos' || producto.categoria === this.categoriaSeleccionada)
      );
    });

    return productosFiltrados;
  }

  agregarProducto() {
    this.enviado = true;
    if (!this.productosForm.valid) return;

    //Generar ID a la hora de crear producto
    this.productosForm.value.idProducto = generarId();

    //Craer producto en firebase
    this.productosService.createProducto(this.productosForm.value)
    .then(() => {
      Swal.fire("Se ha agregado el producto exitosamente", "", "success");
      this.productosForm.reset();
      this.enviado = false;
    })
    .catch(err => {
      console.log(err);
      Swal.fire("Hubo un error al realizar al agregar el producto", "", "error");
      this.enviado = false;
    })
  }

  deleteProducto(idProducto: string) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este producto?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosService.deleteProductoByIdProducto(idProducto)
        .subscribe(() => {
          Swal.fire('Producto eliminado', '', 'success');
        })
      }
    })
  }
} 
