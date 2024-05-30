import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private firestore: AngularFirestore) { }

  getProductos() {
    return this.firestore.collection('productos').snapshotChanges();
  }

  createProducto(producto: Producto) {
    return this.firestore.collection('productos').add(Object.assign({}, producto));
  }

  updateProducto(producto: Producto) {
    this.firestore.doc('productos/' + producto.idProducto).update(producto);
  }

  deleteProducto(id: string) {
    this.firestore.doc('productos/' + id).delete();
  }

}
