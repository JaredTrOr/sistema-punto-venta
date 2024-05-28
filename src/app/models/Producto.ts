export class Producto {
    idProducto?: string;
    imagen!: string;
    descripcion!: string;
    categoria!: string;
    precio!: number;

    precioPromo?: number;
    precioMin?: number;
    status?: boolean;
}