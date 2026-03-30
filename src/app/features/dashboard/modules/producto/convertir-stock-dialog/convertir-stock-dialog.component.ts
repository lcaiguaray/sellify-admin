import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-convertir-stock-dialogo',
  templateUrl: './convertir-stock-dialog.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule]
})
export class ConvertirStockDialogComponent implements OnInit {
  readonly _dialogRef = inject(MatDialogRef<ConvertirStockDialogComponent>);
  readonly data = inject<{ producto: any }>(MAT_DIALOG_DATA);

  producto: any;
  presentacionesDisponibles: any[] = [];

  form = new FormGroup({
    tipoOperacion: new FormControl('EMPACAR', Validators.required), // EMPACAR o DESEMPACAR
    presentacion: new FormControl('', Validators.required), // Ej. CAJA
    cantidadAConvertir: new FormControl(1, [Validators.required, Validators.min(1)]) // Cuántas cajas quiero armar o desarmar
  });

  ngOnInit() {
    // Clonamos el producto para no alterar la tabla maestra hasta que le de a Guardar
    this.producto = JSON.parse(JSON.stringify(this.data.producto));
    this.presentacionesDisponibles = this.producto.equivalencias || [];
  }

  get resumenConversion(): string {
    const presentacionId = this.form.get('presentacion')?.value;
    const tipo = this.form.get('tipoOperacion')?.value;
    const cantidad = this.form.get('cantidadAConvertir')?.value || 0;

    const equivalencia = this.presentacionesDisponibles.find(e => e.unidad === presentacionId);
    if (!equivalencia || cantidad <= 0) return 'Complete los datos para ver el cálculo.';

    const unidadesInvolucradas = equivalencia.factor * cantidad;

    if (tipo === 'EMPACAR') {
      return `Tomarás ${unidadesInvolucradas} ${this.producto.unidadBase}s para formar ${cantidad} ${equivalencia.unidad}(s).`;
    } else {
      return `Abrirás ${cantidad} ${equivalencia.unidad}(s) para obtener ${unidadesInvolucradas} ${this.producto.unidadBase}s sueltas.`;
    }
  }

  convertir() {
    if (this.form.invalid) return;

    const presentacionId = this.form.get('presentacion')?.value;
    const tipo = this.form.get('tipoOperacion')?.value;
    const cantidad = this.form.get('cantidadAConvertir')?.value || 0;

    const eqIndex = this.producto.equivalencias.findIndex((e:any) => e.unidad === presentacionId);
    const equivalencia = this.producto.equivalencias[eqIndex];
    const unidadesInvolucradas = equivalencia.factor * cantidad;

    if (tipo === 'EMPACAR') {
      if (this.producto.stockBase < unidadesInvolucradas) {
        alert(`No tienes suficientes ${this.producto.unidadBase}s. Necesitas ${unidadesInvolucradas}.`);
        return;
      }
      this.producto.stockBase -= unidadesInvolucradas;
      this.producto.equivalencias[eqIndex].stock += cantidad;

    } else { // DESEMPACAR
      if (equivalencia.stock < cantidad) {
        alert(`No tienes suficientes ${equivalencia.unidad}s para abrir. Tienes ${equivalencia.stock}.`);
        return;
      }
      this.producto.equivalencias[eqIndex].stock -= cantidad;
      this.producto.stockBase += unidadesInvolucradas;
    }

    alert('¡Conversión de inventario exitosa!');
    this._dialogRef.close({ productoActualizado: this.producto });
  }
}