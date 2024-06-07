import { ProductoVenta } from "./ProductoVenta";

export class Venta {
    idVenta?: string;
    sucursal!: string;
    fecha?: string;
    hora?: string;

    fechaHora?: Date;

    productos!: ProductoVenta[];
    cantidadGeneral!: number;
    totalGeneral!: number;
}