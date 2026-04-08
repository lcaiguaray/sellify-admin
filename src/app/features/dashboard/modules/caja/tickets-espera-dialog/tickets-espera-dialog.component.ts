import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tickets-espera-dialog',
  templateUrl: './tickets-espera-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, DatePipe]
})
export class TicketsEsperaDialogoComponent {
  readonly _dialogRef = inject(MatDialogRef<TicketsEsperaDialogoComponent>);
  readonly data = inject<{ tickets: any[] }>(MAT_DIALOG_DATA);

  seleccionarTicket(ticket: any) {
    this._dialogRef.close(ticket);
  }
}