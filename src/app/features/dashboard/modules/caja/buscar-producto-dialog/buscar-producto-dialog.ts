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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AlertDialogComponent } from '@app/features/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-buscar-producto-dialog',
  templateUrl: './buscar-producto-dialog.html',
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
    CommonModule,
    MatSelectModule,
    MatIconModule
  ],
})
export class BuscarProductoDialogoComponent implements OnInit {
  @Output() productoSeleccionado = new EventEmitter<any>();

  readonly _dialog = inject(MatDialog);
  readonly _dialogRef = inject(MatDialogRef<BuscarProductoDialogoComponent>);
  private _destroyRef = inject(DestroyRef);
  readonly data = inject<{ productos: any[] }>(MAT_DIALOG_DATA);

  productos = signal<any[]>([]);
  tablaPaginacion = signal<PageEvent>({ pageIndex: 0, pageSize: 5, length: 0 });
  
  tablaColumnas: string[] = ['item', 'producto', 'stock', 'precio'];
  tablaData = signal<any[]>([]);
  tablaIndex = signal<number>(0);

  busquedaControl = new FormControl('');
  categoriaControl = new FormControl('');
  categorias = ['Todas', 'Chocolates', 'Snacks', 'Bebidas'];

  // --- MOCK DATA: GOLOSINAS ---
  private readonly MOCK_PRODUCTOS = [
    { id: 'P001', codigo: 'CHO-001', nombre: 'Chocolate Sublime Clásico', categoria: 'Chocolates', precio: 1.50, stockMostrador: 24, stockAlmacen: 100 },
    { id: 'P002', codigo: 'CHO-002', nombre: 'Triángulo D\'Onofrio', categoria: 'Chocolates', precio: 2.00, stockMostrador: 0, stockAlmacen: 50 }, // AGOTADO EN MOSTRADOR
    { id: 'P003', codigo: 'SNK-001', nombre: 'Papitas Lays Clásicas', categoria: 'Snacks', precio: 2.50, stockMostrador: 10, stockAlmacen: 20 },
    { id: 'P005', codigo: 'BEB-001', nombre: 'Inca Kola 500ml', categoria: 'Bebidas', precio: 3.00, stockMostrador: 0, stockAlmacen: 0 }, // AGOTADO TOTAL
  ];

  ngOnInit() {
    this.productos.set(this.data?.productos ?? []);
    this.handleFiltro();

    this.busquedaControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this._destroyRef)).subscribe(() => this.handleFiltro());
    this.categoriaControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.tablaPaginacion.update(p => ({ ...p, pageIndex: 0 }));
      this.handleFiltro();
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const data = this.tablaData();
    const current = this.tablaIndex();
    if (event.key === 'ArrowDown') { event.preventDefault(); this.tablaIndex.set(Math.min(current + 1, data.length - 1)); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); this.tablaIndex.set(Math.max(current - 1, 0)); return; }
    if (event.key === 'Enter') {
      event.preventDefault();
      const producto = data[current];
      if (producto) this.seleccionarProducto(producto);
      return;
    }
  }

  // --- Lógica estática de Filtrado y Paginación ---
  handleFiltro() {
    const termino = (this.busquedaControl.value || '').toLowerCase();
    const categoria = this.categoriaControl.value;
    let filtrados = this.MOCK_PRODUCTOS.filter(p => 
      (p.nombre.toLowerCase().includes(termino) || p.codigo.toLowerCase().includes(termino)) &&
      (!categoria || categoria === 'Todas' || p.categoria === categoria)
    );
    const startIndex = this.tablaPaginacion().pageIndex * this.tablaPaginacion().pageSize;
    this.tablaData.set(filtrados.slice(startIndex, startIndex + this.tablaPaginacion().pageSize));
    this.tablaPaginacion.update(p => ({ ...p, length: filtrados.length }));
    this.tablaIndex.set(0);
  }

  handlePageEvent(e: PageEvent) { this.tablaPaginacion.set(e); this.handleFiltro(); }
  someProducto(producto: any) { return this.productos().some((p) => p.id === producto.id); }


  // Agrega o quita el producto de la lista local y avisa al padre
  seleccionarProducto(producto: any) {
    if (producto.stockMostrador <= 0 && !this.someProducto(producto)) {
      this._dialog.open(AlertDialogComponent, {
        width: '450px',
        data: {
          tipo: 'error',
          titulo: 'Stock Agotado en Mostrador',
          mensaje: producto.stockAlmacen > 0 
            ? `No hay unidades en mostrador, pero tienes ${producto.stockAlmacen} en Almacén Central. Solicita reposición.` 
            : `El producto está completamente agotado en todas las ubicaciones.`,
          textoConfirmar: 'Entendido'
        }
      });
      return;
    }

    this.productos.update((lista) => {
      const existe = lista.some((p) => p.id === producto.id);
      return existe ? lista.filter((p) => p.id !== producto.id) : [...lista, producto];
    });
    this.productoSeleccionado.emit(producto);
  
  }
}