import { Component, NgZone, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Producto } from '../../../models/Producto';
import { ProductoVenta } from '../../../models/ProductoVenta';
import { Venta } from '../../../models/Ventas';
import  { Tiempo}   from '../../../utils/tiempo';
import { VentasService } from '../../../services/ventas.service';
import { ElectronService } from '../../../services/electron.service';
import { generarId } from '../../../utils/generadorId';
import { Categoria } from '../../../models/Categoria';
import { Modal } from 'bootstrap';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit{

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  carritoProductos: ProductoVenta[] = [];

  //Clase de formato de Time
  tiempo = new Tiempo();

  categoriaSeleccionada = 'todos';
  busquedaTexto = '';

  loadingData: boolean = true;
  isOnline = navigator.onLine;

  //Variables para el modal
  numerosTecladoProductos: number[] = Array.from( { length: 9 }, (_, i) => i + 1);
  productoSeleccionadoModal!: ProductoVenta;
  numerosDisplay: string = '';

  constructor(
    private ventaService: VentasService,
    private electronService: ElectronService,
    private globalService: GlobalService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.getProductosLocal();
    this.getCategoriasLocal();
    this.loadingData = false;
  }

  getProductosLocal() {
    this.electronService.send('get-productos', null);
    this.electronService.on('get-productos', (event, response) => {
      this.ngZone.run(() => {

        response = JSON.parse(response);

        if (response.success) {
          this.productos = response.productos;
          return;
        }

        Swal.fire('Hubo un error al obtener los productos locales', '', 'error');

      });
    });
  }

  getCategoriasLocal() {
    this.electronService.send('get-categorias', null);
    this.electronService.on('get-categorias', (event, response) => {

      response = JSON.parse(response);

      if (response.success) {
        this.ngZone.run(() => {
          this.categorias = response.categorias;
        });

        return;
      }

      Swal.fire('Hubo un error al obtener las categorias locales', '', 'error');

    });
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
          sucursal: this.globalService.getSucursal(),
          fecha: this.tiempo.getDate(),
          hora: this.tiempo.getHora(),
          timestamp: new Date(),
          productos: this.carritoProductos,
          cantidadGeneral: this.getTotalProductos(),
          totalGeneral: this.getTotal()
        }

        //Guardar la venta en firebase
        this.ventaService.createVenta(venta).
        then(() => {
          this.electronService.send('log-info', `${this.globalService.getSucursal}, Frontend, realizarCompra, Se ha realizado la compra exitosamente en firebase`);
        })  
        .catch(err => {
          this.electronService.send('log-error', `${this.globalService.getSucursal}, Frontend, realizarCompra, Hubo un error al insertar la compra en firebase ${err}`);
        }); 

        //Guardar venta en local
        this.electronService.send('create-venta', venta);

        //Realizar ticket
        this.electronService.send('imprimir-ticket', venta);

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

  /*Eventos de modal*/
  abrirModal(productoSeleccionado: ProductoVenta): void {
    this.productoSeleccionadoModal = productoSeleccionado;
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  escribirNumeros(numero: number) {
    this.numerosDisplay += numero;
  }

  borrarNumeros() {
    this.numerosDisplay = this.numerosDisplay.slice(0, -1);
  }

  guardarCambios() {
    if (this.numerosDisplay === '' || this.numerosDisplay === '0') {
      this.numerosDisplay = '';
      return;
    }
    
    this.productoSeleccionadoModal.cantidad = Number.parseInt(this.numerosDisplay);
    this.productoSeleccionadoModal = null as any;
    this.numerosDisplay = '';
  }

}
