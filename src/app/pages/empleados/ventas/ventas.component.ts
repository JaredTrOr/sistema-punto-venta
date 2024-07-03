import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../models/Producto';
import { ProductoVenta } from '../../../models/ProductoVenta';
import { Venta } from '../../../models/Ventas';
import  { Tiempo}   from '../../../utils/tiempo';
import { VentasService } from '../../../services/ventas.service';
import { ElectronService } from '../../../services/electron.service';
import { generarId } from '../../../utils/generadorId';
import { Categoria } from '../../../models/Categoria';
import { CategoriasService } from '../../../services/categorias.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  carritoProductos: ProductoVenta[] = [];
  tiempo = new Tiempo();

  categoriaSeleccionada = 'todos';
  busquedaTexto = '';

  loadingData: boolean = true;

  constructor(
    private productoService: ProductosService, 
    private ventaService: VentasService,
    private electronService: ElectronService,
    private categoriaService: CategoriasService
  ) {}

  ngOnInit() {

    //Obtención de productos desde el firebase
    this.productoService.getProductos().subscribe(
      data => {
        this.productos = data.map(doc => {
          return {
            ...doc.payload.doc.data() as Producto,
              idFirebase: doc.payload.doc.id
          };
        });
        
        this.loadingData = false;
      },
      
      //Si hay un error al obtener los productos desde firebase, se obtienen desde el local
      error => {
        console.log(`Error al obtener los productos desde firebase: ${error}`)

        this.electronService.send('get-productos', null);
        this.electronService.on('get-productos', (event,productos) => {
          console.log('Productos obtenidos desde el local')
          this.productos = JSON.parse(productos);
        });
      }
    );

    //Obtener las categorias por firebase
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data.map(doc => {
        return {
          ...doc.payload.doc.data() as Categoria
        };
      });
    });

    //Obtener categorias de manera local
    // this.electronService.send('get-categorias', null);
    // this.electronService.on('get-categorias', (event, categorias) => {
    //   this.categorias = JSON.parse(categorias);
    // });
    
  }

  agregarProducto(producto: Producto) {

    const productoEnCarrito = this.carritoProductos.find(productoCarrito => productoCarrito.idProducto === producto.idProducto);

    if(productoEnCarrito) {
      productoEnCarrito.cantidad++;
      return;
    }

    this.carritoProductos.push({
      idProducto: producto.idProducto,
      idProductoNumerico: producto.idProductoNumerico,
      nombreProducto: producto.descripcion,
      importe: producto.precio,
      cantidad: 1,
      total: producto.precio
    });

  }

  eliminarProducto(productoId?: string) {
    const productoEnCarrito = this.carritoProductos.find(productoCarrito => productoCarrito.idProducto === productoId);

    const indexOfProductoEnCarrito = this.carritoProductos.indexOf(productoEnCarrito!);
    this.carritoProductos.splice(indexOfProductoEnCarrito, 1);
  }

  getTotalProductos() {
    return this.carritoProductos.reduce((totalProductos, producto) => totalProductos + producto.cantidad, 0);
  }

  getTotal() {
    let total = 0;
    for (const producto of this.carritoProductos) {
      total += producto.importe * producto.cantidad;
    }

    return total;
  }

  sumarProducto(producto: ProductoVenta) {
    producto.cantidad++;
  }

  restarProducto(producto: ProductoVenta) {
    if(producto.cantidad === 1) {
      return;
    }
    producto.cantidad--;
  }

  realizarCompra() {
    if(!this.carritoProductos.length) {
      Swal.fire("No hay productos, no se pued realizar la compra", "", "error");
      return;
    }
    Swal.fire({
      title: "¿Seguro que quieres realizar la venta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, realizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        //Calcular total de cada producto
        this.carritoProductos.forEach(producto => {
          producto.total = producto.importe * producto.cantidad;
        })

        //Realizar la compra 
        const venta: Venta = {
          idVenta: generarId(),
          sucursal: "Sucursal Testing",
          fecha: this.tiempo.getDate(),
          hora: this.tiempo.getHora(),
          timestamp: new Date(),
          productos: this.carritoProductos,
          cantidadGeneral: this.getTotalProductos(),
          totalGeneral: this.getTotal()
        }

        //Guardar la venta en firebase
        this.ventaService.createVenta(venta);

        //Guardar venta en local
        this.electronService.send('create-venta', venta);

        this.carritoProductos = [];
        Swal.fire("Las compra se ha realizado con éxito", "", "success");
      }
    });
  }

  limpiarCarrito() {
    if(!this.carritoProductos.length) {
      Swal.fire("No hay ventas para limpiar", "", "info");
      return;
    }
    Swal.fire({
      title: "¿Seguro que quieres limpiar las ventas?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, limpiar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.carritoProductos = [];
      }
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
