import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-producto-dialogo',
  templateUrl: './producto-dialog.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule]
})
export class ProductoDialogComponent implements OnInit {
  readonly _dialogRef = inject(MatDialogRef<ProductoDialogComponent>);
  readonly data = inject<{ producto?: any }>(MAT_DIALOG_DATA);

  formulario = new FormGroup({
    id: new FormControl(''),
    codigo: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    categoria: new FormControl('Chocolates', Validators.required),
    unidadBase: new FormControl('UNIDAD', Validators.required),
    precioBase: new FormControl(0, [Validators.required, Validators.min(0)]),
    stockBase: new FormControl(0, [Validators.required, Validators.min(0)]),
    // Lista dinámica de presentaciones
    equivalencias: new FormArray([])
  });

  categorias = ['Chocolates', 'Snacks', 'Bebidas', 'Galletas', 'Caramelos'];
  unidadesMedida = ['UNIDAD', 'CAJA', 'PAQUETE', 'BOLSA', 'TIRA', 'DOCENA'];
  esEdicion = false;

  get equivalencias() { return this.formulario.get('equivalencias') as FormArray; }

  ngOnInit() {
    if (this.data?.producto) {
      this.esEdicion = true;
      this.formulario.patchValue(this.data.producto);
      
      // Llenar el FormArray dinámico
      this.data.producto.equivalencias?.forEach((eq: any) => {
        this.agregarEquivalencia(eq.unidad, eq.factor, eq.precio, eq.stock);
      });
    }
  }

  agregarEquivalencia(unidad = 'CAJA', factor = 12, precio = 0, stock = 0) {
    const eqForm = new FormGroup({
      unidad: new FormControl(unidad, Validators.required),
      factor: new FormControl(factor, [Validators.required, Validators.min(2)]), // Ej: 1 Caja = 12 Unidades
      precio: new FormControl(precio, [Validators.required, Validators.min(0)]),
      stock: new FormControl(stock, [Validators.required, Validators.min(0)])
    });
    this.equivalencias.push(eqForm);
  }

  removerEquivalencia(index: number) { this.equivalencias.removeAt(index); }

  guardar() {
    if (this.formulario.invalid) { this.formulario.markAllAsTouched(); return; }
    const formData = this.formulario.value;
    if (!this.esEdicion) formData.id = 'PROD-' + Math.floor(Math.random() * 10000);
    this._dialogRef.close(formData);
  }
}