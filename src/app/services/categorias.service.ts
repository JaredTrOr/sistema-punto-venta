import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Categoria } from '../models/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private firestore: AngularFirestore) { }

  getCategorias() {
    return this.firestore.collection('categorias').snapshotChanges();
  }

  createCategoria(categoria: Categoria) {
    return this.firestore.collection('categorias').add(Object.assign({}, categoria));
  }

  updateCategoria(categoria: Categoria) {
    this.firestore.doc('categorias/' + categoria.idCategoria).update(categoria);
  }

  deleteCategoria(id: string) {
    this.firestore.doc('categorias/' + id).delete();
  }
}
