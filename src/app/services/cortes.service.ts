import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { VentasService } from './ventas.service';
import { Corte } from '../models/Corte';
import { Venta } from '../models/Ventas';

@Injectable({
  providedIn: 'root'
})
export class CortesService {

  constructor(
    private firestore: AngularFirestore,
    private ventasService: VentasService
  ) { }

  getCortes() {
    return this.firestore.collection('cortes').snapshotChanges();
  }

  async createCorte(corte: Corte) {
    console.log('Dentro del corte de firebase')
    //TODO: Implementar manejo de errores    

    //Checar si hay cortes 
    const cortesCollection = this.firestore.collection<Corte>('cortes');
    const ventasCollection = this.firestore.collection<Venta>('ventas');

    // Obtener el último corte
    const cortesSnapshot = await cortesCollection.ref.orderBy('idCorte', 'desc').limit(1).get();
    console.log('Cortes snapshot')
    console.log(cortesSnapshot)
    const ultimoCorte = cortesSnapshot.empty ? null : cortesSnapshot.docs[0].data() as Corte;

    console.log('Ultimo corte');
    console.log(ultimoCorte);

    if (ultimoCorte) {
      //Crear un nuevo corte basado en el último corte
      await cortesCollection.add({
        ...corte,
        //Fecha y hora de inicio del corte
        tiempoInicio: ultimoCorte.tiempoFin,
        tiempoFin: new Date() // --> botonazo
      });

      console.log({ success: true, message: 'Corte creado con firebase' })
      return;
    }

    // Si no hay cortes crear el corte con la primera venta
    const ventasSnapshot = await ventasCollection.ref.orderBy('timestamp', 'asc').limit(1).get();
    const primeraVenta = ventasSnapshot.empty ? null : ventasSnapshot.docs[0].data() as Venta;

    console.log('Primera venta');
    console.log(primeraVenta);

    if (primeraVenta) {
      await cortesCollection.add({
        ...corte,
        //Fecha y hora de inicio del corte
        tiempoInicio: primeraVenta.timestamp,
        tiempoFin: new Date() // --> botonazo
      });

      console.log({ success: true, message: 'Corte creado con firebase' })
      return;
    }
  }
}
