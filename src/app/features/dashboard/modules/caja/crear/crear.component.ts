import { DecimalPipe, DatePipe, DOCUMENT, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BuscarClienteDialogoComponent } from '../buscar-cliente-dialog/buscar-cliente-dialog';
import { BuscarProductoDialogoComponent } from '../buscar-producto-dialog/buscar-producto-dialog';
import { AlertDialogComponent } from '@app/features/components/alert-dialog/alert-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketsEsperaDialogoComponent } from '../tickets-espera-dialog/tickets-espera-dialog.component';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterLink,
    CommonModule,
    MatSnackBarModule
  ],
})
export default class CrearComponent {
  @ViewChild('inputPago') inputPago!: ElementRef<HTMLInputElement>;

  readonly _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _document = inject(DOCUMENT);

  loading = signal(false);
  
  conceptos = signal<any[]>([]);
  conceptoColumnas: string[] = ['nombre', 'cantidad', 'monto', 'total', 'acciones'];

  clienteSeleccionado = signal<any | null>(null);
  ventasEnEspera = signal<any[]>([]);

  total = computed(() =>
    this.conceptos().reduce((sum, c) => sum + ((c.monto ?? 0) * c.cantidad), 0)
  );
  
  pago = signal<number>(0);
  vuelto = computed(() => (this.pago() || 0) - this.total());
  mantenerDatos = signal<boolean>(false);
  resumenPagos = signal<any[]>([]);

  totalResumen = computed(() =>
    this.resumenPagos().reduce((sum, current) => sum + (current.monto ?? 0), 0)
  );

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'F1') { e.preventDefault(); this.buscarAlumnoDialogo(); return; }
    if (e.key === 'F2') { e.preventDefault(); this.buscarProductoDialogo(); return; }
    if (e.key === 'F3') { e.preventDefault(); this.inputPago?.nativeElement?.focus(); return; }
    if (e.key === 'F4') {
      e.preventDefault();
      const win = this._document.defaultView as any;
      if (win) win.location.reload();
      return;
    }
    if (e.key === 'F6') { e.preventDefault(); this.pausarVentaActual(); return; }
    if (e.key === 'Enter') {
      if (this._dialog.openDialogs.length > 0) return;
      e.preventDefault();
      this.guardar();
    }
  }

  pausarVentaActual() {
    if (this.conceptos().length === 0) {
      this._snackBar.open('No hay productos para poner en espera', 'Cerrar', { duration: 2000 });
      return;
    }

    const ticketPausado = {
      id: 'TKT-' + Math.floor(Math.random() * 10000),
      hora: new Date(),
      cliente: this.clienteSeleccionado(),
      conceptos: [...this.conceptos()],
      totalEstimado: this.total()
    };

    this.ventasEnEspera.update(lista => [...lista, ticketPausado]);
    this.limpiarVenta();
    this._snackBar.open('Venta puesta en espera (Pausada)', 'Cerrar', { duration: 3000 });
  }

  abrirGestorEspera() {
    if (this.ventasEnEspera().length === 0) {
      this._snackBar.open('No hay ventas en espera', 'Cerrar', { duration: 2000 });
      return;
    }

    const dialogRef = this._dialog.open(TicketsEsperaDialogoComponent, {
      width: '650px',
      data: { tickets: this.ventasEnEspera() }
    });

    dialogRef.afterClosed().subscribe(ticketSeleccionado => {
      if (ticketSeleccionado) {
        this.recuperarVenta(ticketSeleccionado);
      }
    });
  }

  recuperarVenta(ticket: any) {
    if (this.conceptos().length > 0) {
      this._dialog.open(AlertDialogComponent, {
        width: '400px',
        data: {
          tipo: 'warning',
          titulo: 'Venta en curso',
          mensaje: 'Cobra o pon en pausa los productos actuales antes de recuperar este ticket.'
        }
      });
      return;
    }

    this.clienteSeleccionado.set(ticket.cliente);
    this.conceptos.set(ticket.conceptos);
    
    this.ventasEnEspera.update(lista => lista.filter(t => t.id !== ticket.id));
    this._snackBar.open('Venta recuperada correctamente.', 'OK', { duration: 2000 });
  }

  limpiarVenta() {
    this.conceptos.set([]);
    this.pago.set(0);
    if (!this.mantenerDatos()) {
      this.clienteSeleccionado.set(null);
    }
  }

  displayNombreCliente(cliente: any): string {
    if (!cliente) return '-';
    return `${cliente.nombres} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`.trim();
  }
  buscarAlumnoDialogo() {
    this._dialog.closeAll();
    const dialogRef = this._dialog.open(BuscarClienteDialogoComponent, {
      panelClass: 'mat-dialog-lg',
      data: { cliente: this.clienteSeleccionado() },
    });

    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.clienteSeleccionado.subscribe((cliente: any) => {
        if (this.clienteSeleccionado()?.idCliente !== cliente?.idCliente) {
          this.resumenPagos.set([]); 
        }
        this.clienteSeleccionado.set(cliente);
      });
    });
  }

  buscarProductoDialogo() {
    const dialogRef = this._dialog.open(BuscarProductoDialogoComponent, {
      panelClass: 'mat-dialog-lg',
      data: { productos: this.conceptos() }, 
    });

    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.productoSeleccionado.subscribe((producto: any) => {
        this.conceptos.update((lista) => {
          const existe = lista.some((c) => c.id === producto.id);
          return existe
            ? lista.filter((c) => c.id !== producto.id)
            : [...lista, { ...producto, monto: producto.precio, cantidad: 1 }]; 
        });
      });
    });
  }

  eliminarConcepto(concepto: any) {
    this.conceptos.update((listaActual) =>
      listaActual.filter((c) => c.id !== concepto.id)
    );
  }

  actualizarCantidad(element: any, value: string | number) {
    let cantidad = Number(value);
    if (isNaN(cantidad) || cantidad <= 0) cantidad = 1;
    cantidad = Math.max(1, cantidad);

    this.conceptos.update((conceptos) =>
      conceptos.map((c) => c.id === element.id ? { ...c, cantidad } : c)
    );
  }

  guardar() {
    if (!this.clienteSeleccionado()) {
    this._dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        tipo: 'warning',
        titulo: 'Faltan datos',
        mensaje: 'Debe seleccionar un cliente antes de procesar el pago (Presione F1).'
      }
    });
    return;
  }

  if (!this.conceptos().length) {
    this._dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        tipo: 'warning',
        titulo: 'Carrito vacío',
        mensaje: 'Debe agregar al menos un producto al comprobante (Presione F2).'
      }
    });
    return;
  }

  this.loading.set(true);
  
  setTimeout(() => {
    this._dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        tipo: 'success',
        titulo: '¡Venta Exitosa!',
        mensaje: 'El comprobante ha sido registrado y el stock actualizado.',
        textoConfirmar: 'Aceptar'
      }
    });

    this.resumenPagos.update((pagos) => [...pagos, {  }]);
    this.pago.set(0);
    this.conceptos.set([]);
    if (!this.mantenerDatos()) this.clienteSeleccionado.set(null);
    this.loading.set(false);
  }, 800);
  }
}