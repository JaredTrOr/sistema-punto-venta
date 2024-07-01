import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Producto } from '../models/Producto';
import { Observable, from, map, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private firestore: AngularFirestore) { }

  getProductos() {
    return this.firestore.collection('productos').snapshotChanges();
  }

  getProductoById(idProducto: string)  {
    const productosCollection = this.firestore.collection<Producto>('productos', ref => ref.where('idProducto', '==', idProducto));
    return productosCollection.valueChanges();
  }

  createProducto(producto: Producto) {
    producto.descripcion = producto.descripcion.toUpperCase();
    return this.firestore.collection('productos').add(Object.assign({}, producto));
  }

  updateProducto(producto: Producto) {
    this.firestore.doc('productos/' + producto.idProducto).update(producto);
  }

  deleteProducto(id: string) {
    this.firestore.doc('productos/' + id).delete();
  }

  updateProductoByIdProducto (idProducto: string, updatedData: Producto) {
    updatedData.descripcion = updatedData.descripcion.toUpperCase()
    const productosCollection = this.firestore.collection('productos', ref => ref.where('idProducto', '==', idProducto));
    
    return productosCollection.snapshotChanges().pipe(
      take(1),  // Take only one snapshot
      switchMap(actions => {
        const batch = this.firestore.firestore.batch();
        actions.forEach(a => {
          const doc = a.payload.doc;
          batch.update(doc.ref, updatedData);
        });
        return from(batch.commit());
      })
    );
  }

  deleteProductoByIdProducto (idProducto: string) {
    const productosCollection = this.firestore.collection('productos', ref => ref.where('idProducto', '==', idProducto));
    
    return productosCollection.snapshotChanges().pipe(
      take(1),  // Take only one snapshot
      switchMap(actions => {
        const batch = this.firestore.firestore.batch();
        actions.forEach(a => {
          const doc = a.payload.doc;
          batch.delete(doc.ref);
        });
        return from(batch.commit());
      })
    );
  }

  getNuevoProducto(): Producto {
    return  {
      idProducto: '',
      imagen: '',
      descripcion: '',
      categoria: '',
      precio: 0,
      precioPromo: 0,
      precioMin: 0,
      status: 1
    }
  }

}
