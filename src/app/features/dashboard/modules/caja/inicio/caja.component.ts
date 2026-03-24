import { CommonModule, DecimalPipe, DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink,
    DecimalPipe,
    MatTooltipModule,
    CommonModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
})
export default class CajaComponent implements OnInit {
  private _formBuilder = inject(UntypedFormBuilder);
  readonly _dialog = inject(MatDialog);

  formulario!: UntypedFormGroup;
  tablaLoading = signal(false);
  tablaPaginacion = signal<PageEvent>({
    pageIndex: 0,
    pageSize: 10,
    length: 3, 
  });
  
  tablaColumnas: string[] = ['documento', 'cliente', 'monto', 'fecha', 'tipo', 'estado', 'acciones'];
  footerTablaColumnas = ['documento', 'monto', 'fecha', 'tipo', 'estado', 'acciones'];
  
  // Usamos 'any' ya que no tienes la interfaz Movimiento
  tablaData = signal<any[]>([]);
  tablaMontoTotal = signal<number>(0);

  busquedaControl = new FormControl('');

  // Permisos y estados quemados directamente aquí
  permisosAuth = signal<string[]>(['COMPROBANTE_EMITIR']);
  estados = ['POR VALIDAR', 'PAGADO', 'ANULADO'];

  // Datos 100% estáticos
  private readonly MOCK_DATA: any[] = [
    {
      idMovimiento: 'MOV-001',
      nroSerie: 'F001',
      nroComprobante: '000142',
      cliente: { persona: { nombres: 'Jimmy', apellidoPaterno: 'Dev', apellidoMaterno: '', id: '12345678' } },
      monto: 350.00,
      fechaHoraInicio: '2026-03-24T10:00:00',
      tipo: 'FACTURA',
      estado: 'PAGADO'
    },
    {
      idMovimiento: 'MOV-002',
      nroSerie: 'B001',
      nroComprobante: '000089',
      cliente: { persona: { nombres: 'María', apellidoPaterno: 'González', apellidoMaterno: 'Pérez', id: '87654321' } },
      monto: 120.50,
      fechaHoraInicio: '2026-03-23T15:30:00',
      tipo: 'BOLETA',
      estado: 'POR VALIDAR'
    },
    {
      idMovimiento: 'MOV-003',
      nroSerie: 'F001',
      nroComprobante: '000143',
      cliente: { persona: { nombres: 'Empresa', apellidoPaterno: 'SAC', apellidoMaterno: '', id: '20123456789' } },
      monto: 1500.00,
      fechaHoraInicio: '2026-03-22T09:15:00',
      tipo: 'FACTURA',
      estado: 'ANULADO'
    }
  ];

  ngOnInit() {
    this.formulario = this._formBuilder.group({
      fechas: this._formBuilder.group({
        inicio: [new Date(), Validators.required],
        fin: [new Date(), Validators.required],
      }),
      horas: this._formBuilder.group({
        inicio: ['00:00', Validators.required],
        fin: ['23:59', Validators.required],
      }),
      busqueda: [''],
      estado: [''],
    });

    this.cargarDatosEstaticos();
  }

  getBadgeClass(valor: string): string {
    switch (valor?.toUpperCase()) {
      case 'FACTURA': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'BOLETA': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'PAGADO': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'POR VALIDAR': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ANULADO': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  }

  private cargarDatosEstaticos() {
    this.tablaLoading.set(true);
    setTimeout(() => {
      this.tablaData.set(this.MOCK_DATA);
      const total = this.MOCK_DATA.reduce((acc, curr) => acc + curr.monto, 0);
      this.tablaMontoTotal.set(total);
      this.tablaLoading.set(false);
    }, 500);
  }

  handlePageEvent(e: PageEvent) {
    this.tablaPaginacion.set(e);
  }

  filtrar() {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid || this.tablaLoading()) return;
    this.cargarDatosEstaticos(); 
  }

  exportar(): void { alert('Función de exportar mockeada'); }
  observarDialogo(movimiento: any): void { alert(`Observar comprobante: ${movimiento.nroSerie}`); }
  anularDialogo(movimiento: any): void { alert(`Anular comprobante: ${movimiento.nroSerie}`); }
  verComprobante(movimiento: any): void { alert(`Generando PDF para: ${movimiento.nroSerie}`); }
}