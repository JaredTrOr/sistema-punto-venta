import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Venta } from '../models/Ventas';

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

  updateVenta(venta: Venta) {
    this.firestore.doc('ventas/' + venta.idVenta).update(venta);
  }

  deleteVenta(id: string) {
    this.firestore.doc('ventas/' + id).delete();
  }
}
