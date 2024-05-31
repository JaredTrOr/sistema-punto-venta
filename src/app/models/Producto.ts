export class Producto {
    idFirebase?: string;
    idProducto?: number;
    imagen!: string;
    descripcion!: string;
    categoria!: string;
    precio!: number;

    precioPromo?: number;
    precioMin?: number;
    status?: number;
}