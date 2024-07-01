import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Categoria } from '../models/Categoria';
import { from, switchMap, take } from 'rxjs';

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

  getCategoriaById(idCategoria: string) {
    const categoriasCollecton = this.firestore.collection<Categoria>('categorias', ref => ref.where('idCategoria', '==', idCategoria));
    return categoriasCollecton.valueChanges();
  }

  updateCategoriaByIdCategoria (idCategoria: string, updatedData: any) {
    const categoriaCollection = this.firestore.collection('categorias', ref => ref.where('idCategoria', '==', idCategoria));
    
    return categoriaCollection.snapshotChanges().pipe(
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

  deleteCategoriaByIdCategoria (idCategoria: string) {
    const categoriaCollection = this.firestore.collection('categorias', ref => ref.where('idCategoria', '==', idCategoria));
    
    return categoriaCollection.snapshotChanges().pipe(
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
}
