import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../../models/Categoria';
import { CategoriasService } from '../../../services/categorias.service';
import { generarId } from '../../../utils/generadorId';
import Swal from 'sweetalert2';
import { ElectronService } from '../../../services/electron.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {

  categoriasForm!: FormGroup;
  enviado = false;
  categorias: Categoria[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriasService,
    private electronService: ElectronService,
    private router: Router
  ) { 
    this.setCategoriasForm();
  }

  ngOnInit() {
    this.getCategorias();
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data.map(e => {
        return {
          ...(e.payload.doc.data() as Categoria)
        };
      });
    });
  }

  get myForm() {
    return this.categoriasForm.controls;
  }

  setCategoriasForm() {
    this.categoriasForm = this.formBuilder.group({
      descripcion: ['', Validators.required]
    });
  }

  agregarCategoria() {
    this.enviado = true;

    if (this.categoriasForm.invalid) return;

    const categoria = {
      idCategoria: generarId(),
      descripcion: this.categoriasForm.value.descripcion.toUpperCase()
    };

    this.categoriaService.createCategoria(categoria).then(() => {
      Swal.fire("Se ha agregado la categoria exitosamente", "", "success");
      this.categoriasForm.reset();
      this.enviado = false;

    }).catch((error) => {
      Swal.fire("Ha sucedido un error al agregar la categoria", "", "error");
      this.categoriasForm.reset();
      this.enviado = false;
      console.error('Error al crear la categoria: ', error);
    });

    //Guardado local
    this.electronService.send('create-categoria', categoria);
    
  }

  editarCategoria(idCategoria: string) {
    this.router.navigate(['/editar-categorias', idCategoria])
  }

  eliminarCategoria(idCategoria: string) {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta categoria?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.deleteCategoriaByIdCategoria(idCategoria).subscribe(() => {
          Swal.fire("Se ha eliminado la categoria exitosamente", "", "success");
        }) 
    
        //Eliminado local
        this.electronService.send('delete-categoria', idCategoria);
      }
    });
  }
}
