import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from '../../../services/electron.service';
import { Categoria } from '../../../models/Categoria';
import { Producto } from '../../../models/Producto';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-productos',
  templateUrl: './editar-productos.component.html',
  styleUrl: './editar-productos.component.css'
})
export class EditarProductosComponent {

  producto!: Producto;
  productosForm!: FormGroup;
  categorias: Categoria[] = [];
  enviado = false;

  constructor(
    private productoService: ProductosService,
    private electronService: ElectronService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private router: Router
  ) { 
    this.setProductosForm();
  }

  ngOnInit() {

    const idProducto = this.activatedRoute.snapshot.paramMap.get('id');

    this.productoService.getProductoById(idProducto!).subscribe( data => {
      this.producto = data[0];
      this.productosForm.patchValue(this.producto)
    })

    //Obtener las categorias de manera local
    this.electronService.send('get-categorias', null);
    this.electronService.on('get-categorias', (event, data) => {
      this.categorias = JSON.parse(data);
    });
  }

  setProductosForm() {
    this.productosForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      precio: ['', [Validators.required ,Validators.pattern('^[0-9]+')]],
      precioPromo: ['', Validators.pattern('^[0-9]+')],
      precioMin: ['', Validators.pattern('^[0-9]+')]
    });
  }

  get myForm() {
    return this.productosForm.controls
  }

  editarProducto() {
    Swal.fire({
      title: '¿Estás seguro de modificar este producto?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviado = true;
        if (!this.productosForm.valid) return;

        this.productoService.updateProductoByIdProducto(this.producto.idProducto!, this.productosForm.value)
        .subscribe(() => {
          Swal.fire(
            'Producto modificado',
            'El producto ha sido modificado correctamente',
            'success'
          );

          this.ngZone.run(() => {
            this.router.navigateByUrl('/admin-productos')
          })
        })
      }
    })
  }
  

}
