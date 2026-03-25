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
    CommonModule
  ],
})
export default class CrearComponent {
  @ViewChild('inputPago') inputPago!: ElementRef<HTMLInputElement>;

  readonly _dialog = inject(MatDialog);
  private _document = inject(DOCUMENT);

  loading = signal(false);
  
  // Usamos 'any' al no tener las interfaces
  conceptos = signal<any[]>([]);
  conceptoColumnas: string[] = ['nombre', 'cantidad', 'monto', 'total', 'acciones'];

  clienteSeleccionado = signal<any | null>(null);

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
    if (e.key === 'Enter') {
      if (this._dialog.openDialogs.length > 0) return;
      e.preventDefault();
      this.guardar();
    }
  }

  displayNombreCliente(cliente: any): string {
    if (!cliente) return '-';
    return `${cliente.nombres} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`.trim();
  }
  // --- MOCK: Simula la selección de un alumno ---
  buscarAlumnoDialogo() {
    this._dialog.closeAll();
    const dialogRef = this._dialog.open(BuscarClienteDialogoComponent, {
      panelClass: 'mat-dialog-lg',
      data: { cliente: this.clienteSeleccionado() },
    });

    // Nos suscribimos para escuchar cuando se seleccione un cliente desde la tabla del modal
    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.clienteSeleccionado.subscribe((cliente: any) => {
        if (this.clienteSeleccionado()?.idCliente !== cliente?.idCliente) {
          this.resumenPagos.set([]); // Reseteamos los pagos si cambia de cliente
        }
        this.clienteSeleccionado.set(cliente);
      });
    });
  }

  // --- MOCK: Simula la selección de un concepto ---
  buscarProductoDialogo() {
    // IMPORTANTE: Asegúrate de importar el componente BuscarProductoDialogoComponent
    const dialogRef = this._dialog.open(BuscarProductoDialogoComponent, {
      panelClass: 'mat-dialog-lg',
      // Le pasamos los productos que ya están en la tabla para que los marque de verde
      data: { productos: this.conceptos() }, 
    });

    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.productoSeleccionado.subscribe((producto: any) => {
        // La misma lógica de toogle: si existe lo quita, si no, lo agrega
        this.conceptos.update((lista) => {
          const existe = lista.some((c) => c.id === producto.id);
          return existe
            ? lista.filter((c) => c.id !== producto.id)
            // Ojo: cambiamos 'monto' por 'precio' al agregarlo
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

  // --- MOCK: Simula el guardado en base de datos ---
  guardar() {
    if (!this.clienteSeleccionado()) {
      alert('Error: Debe seleccionar un cliente (Presione F1 o Buscar)');
      return;
    }

    if (!this.conceptos().length) {
      alert('Error: Debe seleccionar al menos un concepto (Presione F2 o Agregar)');
      return;
    }

    if ((this.pago() || 0) < this.total()) {
      alert('Error: El monto de pago no puede ser menor al total');
      return;
    }

    this.loading.set(true);
    
    setTimeout(() => {
      alert('¡Éxito! Se ha registrado correctamente.');
      
      const mockComprobanteGenerado = {
        idMovimiento: 'MOV-' + Math.floor(Math.random() * 10000),
        nroSerie: 'B001',
        nroComprobante: '00' + Math.floor(Math.random() * 10000),
        monto: this.total()
      };

      this.resumenPagos.update((pagos) => [...pagos, mockComprobanteGenerado]);
      this.pago.set(0);
      this.conceptos.set([]);
      
      if (!this.mantenerDatos()) {
        this.clienteSeleccionado.set(null); // Limpiamos el cliente
        this.resumenPagos.set([]); 
      }

      this.loading.set(false);
      
    }, 800);
  }
}