import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface AlertDialogData {
  titulo?: string;
  mensaje: string;
  tipo?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  textoConfirmar?: string;
  textoCancelar?: string;
  mostrarCancelar?: boolean;
  colorConfirmar?: 'primary' | 'accent' | 'warn' | string;
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class AlertDialogComponent {
  data = inject<AlertDialogData>(MAT_DIALOG_DATA);

  get iconoConfig() {
    switch (this.data.tipo) {
      case 'success': 
        return { icon: 'tabler--circle-check-filled', color: 'text-emerald-500', bg: 'bg-emerald-100' };
      case 'error': 
        return { icon: 'tabler--alert-circle-filled', color: 'text-rose-500', bg: 'bg-rose-100' };
      case 'warning': 
        return { icon: 'tabler--alert-triangle-filled', color: 'text-amber-500', bg: 'bg-amber-100' };
      case 'info': 
        return { icon: 'tabler--info-circle-filled', color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'confirm':
      default: 
        return { icon: 'tabler--help-circle-filled', color: 'text-indigo-500', bg: 'bg-indigo-100' };
    }
  }

  get mostrarCancelar(): boolean {
    if (this.data.mostrarCancelar !== undefined) {
      return this.data.mostrarCancelar;
    }
    return this.data.tipo === 'confirm';
  }
}