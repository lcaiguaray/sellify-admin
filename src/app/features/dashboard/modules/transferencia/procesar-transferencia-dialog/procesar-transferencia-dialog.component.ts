import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-procesar-transferencia-dialogo',
  templateUrl: './procesar-transferencia-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule]
})
export class ProcesarTransferenciaDialogoComponent implements OnInit {
  readonly _dialogRef = inject(MatDialogRef<ProcesarTransferenciaDialogoComponent>);
  readonly data = inject<{ transferencia: any }>(MAT_DIALOG_DATA);

  transferencia = signal<any>(null);
  columnas: string[] = ['producto', 'cantidad'];

  ngOnInit() {
    // Clonamos para trabajar sobre una copia
    this.transferencia.set(JSON.parse(JSON.stringify(this.data.transferencia)));
  }

  get titulo(): string {
    const estado = this.transferencia()?.estado;
    if (estado === 'SOLICITADO') return 'Confirmar Despacho de Mercancía';
    if (estado === 'DESPACHADO') return 'Confirmar Recepción en Mostrador';
    return 'Detalle de Transferencia';
  }

  get textoBoton(): string {
    const estado = this.transferencia()?.estado;
    if (estado === 'SOLICITADO') return 'Confirmar Envío';
    if (estado === 'DESPACHADO') return 'Confirmar Recepción';
    return 'Cerrar';
  }

  procesar() {
    this._dialogRef.close(true);
  }
}