import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Venta } from '../models/Ventas';
import { from, map, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private firestore: AngularFirestore) { }

  getVentas() {
    return this.firestore.collection('ventas').snapshotChanges();
  }

  createVenta(venta: Venta) {
    return this.firestore.collection('ventas').add(Object.assign({}, venta));
  }

  updateVentaByIdVenta (idVenta: string, updatedData: any) {
    const ventasCollection = this.firestore.collection('ventas', ref => ref.where('idVenta', '==', idVenta));
    
    return ventasCollection.snapshotChanges().pipe(
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

  //Manera Tradicional por ID de firebase
  updateVenta(venta: Venta) {
    this.firestore.doc('ventas/' + venta.idVenta).update(venta);
  }

  deleteVentaByIdVenta (idVenta: string) {
    const ventasCollection = this.firestore.collection('ventas', ref => ref.where('idVenta', '==', idVenta));
    
    return ventasCollection.snapshotChanges().pipe(
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
  
  //Manera Tradicional por ID de firebase
  deleteVenta(id: string) {
    this.firestore.doc('ventas/' + id).delete();
  }
}
