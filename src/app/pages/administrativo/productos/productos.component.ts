import { Component } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  productos = [
    {
      id: 1,
      nombre: 'Producto 1',
      precio: 100.00,
      categoria: 'Categoria 1'
    },
    {
      id: 2,
      nombre: 'Producto 2',
      precio: 200.00,
      categoria: 'Categoria 2'
    },
    {
      id: 3,
      nombre: 'Producto 3',
      precio: 300.00,
      categoria: 'Categoria 3'
    },
    {
      id: 4,
      nombre: 'Producto 4',
      precio: 150.00,
      categoria: 'Categoria 1'
    },
    {
      id: 5,
      nombre: 'Producto 5',
      precio: 250.00,
      categoria: 'Categoria 2'
    },
    {
      id: 6,
      nombre: 'Producto 6',
      precio: 350.00,
      categoria: 'Categoria 3'
    },
    {
      id: 7,
      nombre: 'Producto 7',
      precio: 175.00,
      categoria: 'Categoria 1'
    },
    {
      id: 8,
      nombre: 'Producto 8',
      precio: 275.00,
      categoria: 'Categoria 2'
    },
    {
      id: 9,
      nombre: 'Producto 9',
      precio: 375.00,
      categoria: 'Categoria 3'
    },
    {
      id: 10,
      nombre: 'Producto 10',
      precio: 200.00,
      categoria: 'Categoria 1'
    },
    {
      id: 11,
      nombre: 'Producto 11',
      precio: 300.00,
      categoria: 'Categoria 2'
    },
    {
      id: 12,
      nombre: 'Producto 12',
      precio: 400.00,
      categoria: 'Categoria 3'
    },
    {
      id: 13,
      nombre: 'Producto 13',
      precio: 225.00,
      categoria: 'Categoria 1'
    },
    {
      id: 14,
      nombre: 'Producto 14',
      precio: 325.00,
      categoria: 'Categoria 2'
    },
    {
      id: 15,
      nombre: 'Producto 15',
      precio: 425.00,
      categoria: 'Categoria 3'
    }
  ];
}
