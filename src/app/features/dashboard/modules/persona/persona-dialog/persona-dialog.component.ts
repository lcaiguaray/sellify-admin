import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-persona-dialog',
  templateUrl: './persona-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ]
})
export class PersonaDialogComponent implements OnInit {
  readonly _dialogRef = inject(MatDialogRef<PersonaDialogComponent>);
  readonly data = inject<{ persona?: any }>(MAT_DIALOG_DATA);

  // Formulario Reactivo
  formulario = new FormGroup({
    id: new FormControl(''),
    nombres: new FormControl('', Validators.required),
    apellidoPaterno: new FormControl('', Validators.required),
    apellidoMaterno: new FormControl(''),
    tipoDocumento: new FormControl('DNI', Validators.required),
    documento: new FormControl('', Validators.required),
    roles: new FormControl<string[]>([], Validators.required), // Selección múltiple
  });

  tiposDocumento = ['DNI', 'RUC', 'CE', 'PASAPORTE'];
  listaRoles = ['CLIENTE', 'PROVEEDOR', 'CAJERO', 'ALMACEN', 'VENDEDOR', 'ADMINISTRADOR'];

  esEdicion = false;

  ngOnInit() {
    if (this.data?.persona) {
      this.esEdicion = true;
      this.formulario.patchValue(this.data.persona);
    }
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // Simulamos guardado
    const formData = this.formulario.value;
    
    // Si es nuevo, le generamos un ID simulado
    if (!this.esEdicion) {
      formData.id = 'PER-' + Math.floor(Math.random() * 10000);
    }

    // Retornamos la data al componente padre
    this._dialogRef.close(formData);
  }
}