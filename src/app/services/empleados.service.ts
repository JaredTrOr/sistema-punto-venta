import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Empleado } from '../models/Empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private firestore: AngularFirestore) { }

  getEmpleados() {
    return this.firestore.collection('empleados').snapshotChanges();
  }

  createEmpleado(empleado: Empleado) {
    return this.firestore.collection('empleados').add(Object.assign({}, empleado));
  }

  updateEmpleado(empleado: Empleado) {
    this.firestore.doc('empleados/' + empleado.idEmpleado).update(empleado);
  }

  deleteEmpleado(id: string) {
    this.firestore.doc('empleados/' + id).delete();
  }
}
