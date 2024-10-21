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

  //Variables para el modal
  numerosTecladoProductos: number[] = Array.from( { length: 9 }, (_, i) => i + 1);
  productoSeleccionadoModal!: ProductoVenta;
  numerosDisplay: string = '';
  ordenarPor: string[] = [];
  ordenarPorSeleccionado: string = 'Reciente';
  //Modal cambio
  recibido!: number;
  

  constructor(
    private ventaService: VentasService,
    private electronService: ElectronService,
    private globalService: GlobalService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.getProductosLocal();
    this.getCategoriasLocal();
    this.loadingData = false;
    this.ordenarPor = ['Reciente', 'Alfabético', 'Popular', 'Precio'];
    // this.productos = [
    //   {
    //     idProducto: 'A001',
    //     idProductoNumerico: 1001,
    //     imagen: 'producto1.jpg',
    //     descripcion: 'Laptop 14 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 15000,
    //     precioPromo: 14000,
    //     precioMin: 13500,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A002',
    //     idProductoNumerico: 1002,
    //     imagen: 'producto2.jpg',
    //     descripcion: 'Smartphone 6 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 8000,
    //     precioPromo: 7500,
    //     precioMin: 7300,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A003',
    //     idProductoNumerico: 1003,
    //     imagen: 'producto3.jpg',
    //     descripcion: 'Audífonos Bluetooth',
    //     categoria: 'Accesorios',
    //     precio: 1200,
    //     precioPromo: 1000,
    //     precioMin: 900,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A004',
    //     idProductoNumerico: 1004,
    //     imagen: 'producto4.jpg',
    //     descripcion: 'Mouse inalámbrico',
    //     categoria: 'Accesorios',
    //     precio: 500,
    //     precioPromo: 450,
    //     precioMin: 400,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A005',
    //     idProductoNumerico: 1005,
    //     imagen: 'producto5.jpg',
    //     descripcion: 'Teclado mecánico',
    //     categoria: 'Electrónica',
    //     precio: 2000,
    //     precioPromo: 1800,
    //     precioMin: 1700,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A006',
    //     idProductoNumerico: 1006,
    //     imagen: 'producto6.jpg',
    //     descripcion: 'Cámara digital',
    //     categoria: 'Fotografía',
    //     precio: 5000,
    //     precioPromo: 4500,
    //     precioMin: 4300,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A007',
    //     idProductoNumerico: 1007,
    //     imagen: 'producto7.jpg',
    //     descripcion: 'Tablet 10 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 9000,
    //     precioPromo: 8500,
    //     precioMin: 8300,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A008',
    //     idProductoNumerico: 1008,
    //     imagen: 'producto8.jpg',
    //     descripcion: 'Monitor 24 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 4000,
    //     precioPromo: 3700,
    //     precioMin: 3600,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A009',
    //     idProductoNumerico: 1009,
    //     imagen: 'producto9.jpg',
    //     descripcion: 'Consola de videojuegos',
    //     categoria: 'Entretenimiento',
    //     precio: 12000,
    //     precioPromo: 11500,
    //     precioMin: 11000,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A010',
    //     idProductoNumerico: 1010,
    //     imagen: 'producto10.jpg',
    //     descripcion: 'Smartwatch deportivo',
    //     categoria: 'Accesorios',
    //     precio: 2500,
    //     precioPromo: 2300,
    //     precioMin: 2200,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A001',
    //     idProductoNumerico: 1001,
    //     imagen: 'producto1.jpg',
    //     descripcion: 'Laptop 14 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 15000,
    //     precioPromo: 14000,
    //     precioMin: 13500,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A002',
    //     idProductoNumerico: 1002,
    //     imagen: 'producto2.jpg',
    //     descripcion: 'Smartphone 6 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 8000,
    //     precioPromo: 7500,
    //     precioMin: 7300,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A003',
    //     idProductoNumerico: 1003,
    //     imagen: 'producto3.jpg',
    //     descripcion: 'Audífonos Bluetooth',
    //     categoria: 'Accesorios',
    //     precio: 1200,
    //     precioPromo: 1000,
    //     precioMin: 900,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A004',
    //     idProductoNumerico: 1004,
    //     imagen: 'producto4.jpg',
    //     descripcion: 'Mouse inalámbrico',
    //     categoria: 'Accesorios',
    //     precio: 500,
    //     precioPromo: 450,
    //     precioMin: 400,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A005',
    //     idProductoNumerico: 1005,
    //     imagen: 'producto5.jpg',
    //     descripcion: 'Teclado mecánico',
    //     categoria: 'Electrónica',
    //     precio: 2000,
    //     precioPromo: 1800,
    //     precioMin: 1700,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A006',
    //     idProductoNumerico: 1006,
    //     imagen: 'producto6.jpg',
    //     descripcion: 'Cámara digital',
    //     categoria: 'Fotografía',
    //     precio: 5000,
    //     precioPromo: 4500,
    //     precioMin: 4300,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A007',
    //     idProductoNumerico: 1007,
    //     imagen: 'producto7.jpg',
    //     descripcion: 'Tablet 10 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 9000,
    //     precioPromo: 8500,
    //     precioMin: 8300,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A008',
    //     idProductoNumerico: 1008,
    //     imagen: 'producto8.jpg',
    //     descripcion: 'Monitor 24 pulgadas',
    //     categoria: 'Electrónica',
    //     precio: 4000,
    //     precioPromo: 3700,
    //     precioMin: 3600,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A009',
    //     idProductoNumerico: 1009,
    //     imagen: 'producto9.jpg',
    //     descripcion: 'Consola de videojuegos',
    //     categoria: 'Entretenimiento',
    //     precio: 12000,
    //     precioPromo: 11500,
    //     precioMin: 11000,
    //     status: 1
    //   },
    //   {
    //     idProducto: 'A010',
    //     idProductoNumerico: 1010,
    //     imagen: 'producto10.jpg',
    //     descripcion: 'Smartwatch deportivo',
    //     categoria: 'Accesorios',
    //     precio: 2500,
    //     precioPromo: 2300,
    //     precioMin: 2200,
    //     status: 1
    //   }
    // ];
  
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

  onClickCompra() {
    if(!this.carritoProductos.length) {
      Swal.fire("No hay productos, no se pued realizar la compra", "", "error");
      return;
    }

    this.abrirModalPago();
  }

  realizarCompra() {
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

    const sucursal = this.globalService.getSucursal();

    //Guardar la venta en firebase
    this.ventaService.createVenta(venta).
    then(() => {
      this.electronService.send('log-info', `${sucursal}, Frontend, realizarCompra, Se ha realizado la compra exitosamente en firebase`);
    })  
    .catch(err => {
      this.electronService.send('log-error', `${sucursal}, Frontend, realizarCompra, Hubo un error al insertar la compra en firebase ${err}`);
    }); 

    //Guardar venta en local
    this.electronService.send('create-venta', venta);

    //Realizar ticket
    this.electronService.send('imprimir-ticket', venta);

    this.carritoProductos = [];
    this.recibido = 0;
    Swal.fire("Las compra se ha realizado con éxito", "", "success");
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
      
      if (result.isConfirmed) {
        this.carritoProductos = [];
      }
    });
  }

  filtrar(): Producto[] {
    const startsWithMatch = this.productos.some(producto =>
      producto.descripcion.toLowerCase().startsWith(this.busquedaTexto.toLowerCase())
    );
  
    const productosFiltrados = this.productos.filter(producto => {
      const matchesBusqueda = startsWithMatch
        ? producto.descripcion.toLowerCase().startsWith(this.busquedaTexto.toLowerCase())
        : producto.descripcion.toLowerCase().includes(this.busquedaTexto.toLowerCase());
  
      return (
        matchesBusqueda &&
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

  abrirModalPago() {
    const modalElement = document.getElementById('modalPago');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  calcularCambio() {
    const resultado = this.recibido - this.getTotal();
    return Number.isNaN(resultado) ? '' : resultado;
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
