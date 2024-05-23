import { Component } from '@angular/core';
import { Producto } from '../../../models/ProductoEjemplo';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  productos: Producto[] = [];
  carritoProductos: Producto[] = [];

  constructor() {}

  ngOnInit() {
    this.productos = [
      {
        id: 1,
        nombre: 'Producto 1',
        precio: 100,
        categoria: 'Categoria 1'
      },
      {
        id: 2,
        nombre: 'Producto 2',
        precio: 200,
        categoria: 'Categoria 2'
      },
      {
        id: 3,
        nombre: 'Producto 3',
        precio: 300,
        categoria: 'Categoria 3'
      },
      {
        id: 4,
        nombre: 'Producto 4',
        precio: 150,
        categoria: 'Categoria 1'
      },
      {
        id: 5,
        nombre: 'Producto 5',
        precio: 250,
        categoria: 'Categoria 2'
      },
      {
        id: 6,
        nombre: 'Producto 6',
        precio: 350,
        categoria: 'Categoria 3'
      },
      {
        id: 7,
        nombre: 'Producto 7',
        precio: 175,
        categoria: 'Categoria 1'
      },
      {
        id: 8,
        nombre: 'Producto 8',
        precio: 275,
        categoria: 'Categoria 2'
      },
      {
        id: 9,
        nombre: 'Producto 9',
        precio: 375,
        categoria: 'Categoria 3'
      },
      {
        id: 10,
        nombre: 'Producto 10',
        precio: 200,
        categoria: 'Categoria 1'
      },
      {
        id: 11,
        nombre: 'Producto 11',
        precio: 300,
        categoria: 'Categoria 2'
      },
      {
        id: 12,
        nombre: 'Producto 12',
        precio: 400,
        categoria: 'Categoria 3'
      },
      {
        id: 13,
        nombre: 'Producto 13',
        precio: 225,
        categoria: 'Categoria 1'
      },
      {
        id: 14,
        nombre: 'Producto 14',
        precio: 325,
        categoria: 'Categoria 2'
      },
      {
        id: 15,
        nombre: 'Producto 15',
        precio: 425,
        categoria: 'Categoria 3'
      }
  ];
  }

  agregarProducto(producto: Producto) {
    this.carritoProductos.push(producto);
  }


}
