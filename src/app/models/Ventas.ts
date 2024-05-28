import { ProductoVenta } from "./ProductoVenta";

export class Venta {
    idVenta?: string;
    sucursal!: string;
    fecha!: string;
    hora!: string;

    productos!: ProductoVenta[];
    cantidadGeneral!: number;
    totalGeneral!: number;
}