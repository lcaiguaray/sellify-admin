import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-buscar-cliente-dialog',
  templateUrl: './buscar-cliente-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    CommonModule,
  ],
})
export class BuscarClienteDialogoComponent implements OnInit {
  @Output() clienteSeleccionado = new EventEmitter<any>();

  readonly _dialog = inject(MatDialog);
  readonly _dialogRef = inject(MatDialogRef<BuscarClienteDialogoComponent>);
  private _destroyRef = inject(DestroyRef);
  readonly data = inject<{ cliente: any }>(MAT_DIALOG_DATA);

  cliente = signal<any | null>(null);

  tablaLoading = signal(false);
  tablaPaginacion = signal<PageEvent>({
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  });
  
  tablaColumnas: string[] = ['item', 'cliente', 'documento', 'tipo'];
  tablaData = signal<any[]>([]);
  tablaIndex = signal<number>(0);

  busquedaControl = new FormControl('');

  private readonly MOCK_CLIENTES = [
    { idCliente: 'CLI-001', nombres: 'Juan', apellidoPaterno: 'Pérez', apellidoMaterno: 'Gómez', documento: '12345678', tipo: 'NATURAL' },
    { idCliente: 'CLI-002', nombres: 'María', apellidoPaterno: 'López', apellidoMaterno: 'Díaz', documento: '87654321', tipo: 'NATURAL' },
    { idCliente: 'CLI-003', nombres: 'Empresa Tecnológica', apellidoPaterno: 'S.A.C.', apellidoMaterno: '', documento: '20123456789', tipo: 'JURIDICA' },
    { idCliente: 'CLI-004', nombres: 'Carlos', apellidoPaterno: 'Ruiz', apellidoMaterno: 'Zavaleta', documento: '45678912', tipo: 'NATURAL' },
    { idCliente: 'CLI-005', nombres: 'Comercializadora', apellidoPaterno: 'E.I.R.L.', apellidoMaterno: '', documento: '20987654321', tipo: 'JURIDICA' },
  ];

  ngOnInit() {
    this.cliente.set(this.data?.cliente ?? null);
    
    this.handleFiltro('');

    this.busquedaControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((term) => {
        this.handleFiltro(term);
      });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const data = this.tablaData();
    const current = this.tablaIndex();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.tablaIndex.set(Math.min(current + 1, data.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.tablaIndex.set(Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const cliente = data[current];
      if (cliente) {
        this.seleccionarCliente(cliente);
      }
      return;
    }
  }

  displayNombreCliente(cliente: any): string {
    if (!cliente) return '';
    return `${cliente.nombres} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`.trim();
  }

  handleFiltro(term: string | null) {
    this.tablaLoading.set(true);
    
    setTimeout(() => {
      const busqueda = (term || '').toLowerCase();
      const filtrados = this.MOCK_CLIENTES.filter(c => 
        `${c.nombres} ${c.apellidoPaterno} ${c.apellidoMaterno} ${c.documento}`.toLowerCase().includes(busqueda)
      );

      this.tablaData.set(filtrados);
      this.tablaPaginacion.update(p => ({ ...p, length: filtrados.length }));
      this.tablaIndex.set(0); 
      this.tablaLoading.set(false);
    }, 400); 
  }

  handlePageEvent(e: PageEvent) {
    this.tablaPaginacion.set(e);
  }

  seleccionarCliente(cliente: any) {
    this.cliente.update((i) => (i?.idCliente === cliente.idCliente ? null : cliente));
    this.clienteSeleccionado.emit(this.cliente());
    this._dialogRef.close(this.cliente()); 
  }

  crearCliente() {
    alert('Función de crear cliente mockeada. Aquí se abriría el modal de creación.');
  }
}