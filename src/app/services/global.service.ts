import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private sucursal!: string;
  constructor() { }

  setSucursal(sucursal: string) {
    this.sucursal = sucursal;
  }

  getSucursal(): string {
    return this.sucursal;
  }
}
