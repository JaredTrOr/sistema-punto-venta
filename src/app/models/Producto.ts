export class Producto {
    idProducto?: string;
    idProductoNumerico?: number;
    imagen!: string;
    descripcion!: string;
    categoria!: string;
    precio!: number;

    precioPromo?: number;
    precioMin?: number;
    status?: number;
}