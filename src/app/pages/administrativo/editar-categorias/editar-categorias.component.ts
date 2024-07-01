import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriasService } from '../../../services/categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-categorias',
  templateUrl: './editar-categorias.component.html',
  styleUrl: './editar-categorias.component.css'
})
export class EditarCategoriasComponent {

  categoriasForm!: FormGroup;
  enviado = false;

  constructor(
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private categoriaService: CategoriasService
  ) { 
    this.setCategoriaForm();
  }

  ngOnInit() {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.categoriaService.getCategoriaById(id!).subscribe(data => {
      this.categoriasForm.patchValue(data[0]);
    })
  }

  setCategoriaForm() {
    this.categoriasForm = this.formBuilder.group({
      descripcion: ['', Validators.required]
    });
  }

  get myForm() {
    return this.categoriasForm.controls;
  }

  editarCategoria() {
    this.enviado = true;

    if (this.categoriasForm.invalid) return;

    const id = this.activeRoute.snapshot.paramMap.get('id');
    this.categoriaService.updateCategoriaByIdCategoria(id!, this.categoriasForm.value).subscribe(() => {
      Swal.fire('Categoria actualizada', 'La categoria ha sido actualizada correctamente', 'success')
      });
  }

}
