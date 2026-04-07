import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

import { AlertDialogComponent } from '@app/features/components/alert-dialog/alert-dialog.component';
import { NuevaTransferenciaDialogoComponent } from '../nueva-transferencia-dialog/nueva-transferencia-dialog.component';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule, 
    RouterLink, MatSnackBarModule, DatePipe
  ]
})
export default class TransferenciaComponent implements OnInit {
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  busquedaControl = new FormControl('');
  tablaLoading = signal(false);
  tablaData = signal<any[]>([]);
  
  tablaColumnas: string[] = ['id', 'fecha', 'origen', 'destino', 'items', 'estado', 'acciones'];
  tablaPaginacion = signal<PageEvent>({ pageIndex: 0, pageSize: 10, length: 0 });

  // --- MOCK DATA PROFESIONAL ---
  private mockTransferencias: any[] = [
    { 
      id: 'TR-2026-001', fecha: new Date('2026-04-01T09:00:00'), 
      solicitante: 'Lucía V.', rolSolicitante: 'VENDEDORA',
      origen: 'ALMACÉN CENTRAL', destino: 'MOSTRADOR 01',
      itemsCount: 5, estado: 'SOLICITADO',
      detalle: [{ producto: 'Sublime', cant: 24 }, { producto: 'Oreo', cant: 12 }]
    },
    { 
      id: 'TR-2026-002', fecha: new Date('2026-04-02T14:30:00'), 
      solicitante: 'Marcos P.', rolSolicitante: 'CAJERO',
      origen: 'ALMACÉN CENTRAL', destino: 'MOSTRADOR 02',
      itemsCount: 2, estado: 'DESPACHADO',
      detalle: [{ producto: 'Inca Kola 500ml', cant: 15 }]
    },
    { 
      id: 'TR-2026-003', fecha: new Date('2026-04-03T11:15:00'), 
      solicitante: 'Gemini Dev', rolSolicitante: 'ADMIN',
      origen: 'ALMACÉN CENTRAL', destino: 'MOSTRADOR 01',
      itemsCount: 8, estado: 'RECIBIDO',
      detalle: [{ producto: 'Lays Clásicas', cant: 10 }]
    }
  ];

  ngOnInit() {
    this.cargarDatos();
    this.busquedaControl.valueChanges.subscribe(term => this.filtrarDatos(term || ''));
  }

  cargarDatos() {
    this.tablaData.set([...this.mockTransferencias]);
    this.tablaPaginacion.update(p => ({ ...p, length: this.mockTransferencias.length }));
  }

  filtrarDatos(term: string) {
    const busqueda = term.toLowerCase();
    const filtrados = this.mockTransferencias.filter(t => 
      `${t.id} ${t.solicitante} ${t.estado}`.toLowerCase().includes(busqueda)
    );
    this.tablaData.set(filtrados);
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'SOLICITADO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DESPACHADO': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'RECIBIDO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'RECHAZADO': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  abrirNuevaSolicitud() {
    const dialogRef = this._dialog.open(NuevaTransferenciaDialogoComponent, {
      width: '700px',
      panelClass: 'mat-dialog-lg'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.mockTransferencias.unshift(res);
        this.cargarDatos();
        this._snackBar.open('Solicitud de reposición enviada', 'Cerrar', { duration: 3000 });
      }
    });
  }

  procesarTransferencia(t: any) {
    // Si eres almacenero, pasas de SOLICITADO -> DESPACHADO
    if (t.estado === 'SOLICITADO') {
      const dialogRef = this._dialog.open(AlertDialogComponent, {
        width: '400px',
        data: {
          tipo: 'confirm',
          titulo: '¿Despachar Mercancía?',
          mensaje: `Vas a confirmar la salida de ${t.itemsCount} productos desde Almacén hacia ${t.destino}.`,
          textoConfirmar: 'Sí, Despachar',
          colorConfirmar: 'primary'
        }
      });

      dialogRef.afterClosed().subscribe(ok => {
        if (ok) {
          this.actualizarEstado(t.id, 'DESPACHADO');
          this._snackBar.open('Productos en tránsito', 'OK');
        }
      });
    } 
    // Si eres vendedora, pasas de DESPACHADO -> RECIBIDO
    else if (t.estado === 'DESPACHADO') {
      const dialogRef = this._dialog.open(AlertDialogComponent, {
        width: '400px',
        data: {
          tipo: 'success',
          titulo: '¿Mercancía Recibida?',
          mensaje: `Confirma que has recibido los productos en el ${t.destino} para aumentar tu stock de venta.`,
          textoConfirmar: 'Confirmar Recepción'
        }
      });

      dialogRef.afterClosed().subscribe(ok => {
        if (ok) {
          this.actualizarEstado(t.id, 'RECIBIDO');
          this._snackBar.open('Stock de mostrador actualizado', 'OK');
        }
      });
    }
  }

  private actualizarEstado(id: string, nuevoEstado: string) {
    const index = this.mockTransferencias.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTransferencias[index].estado = nuevoEstado;
      this.cargarDatos();
    }
  }

  handlePageEvent(e: PageEvent) { this.tablaPaginacion.set(e); }
}