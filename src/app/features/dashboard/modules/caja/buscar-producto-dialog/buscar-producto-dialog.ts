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
  // Emitimos 'any' al no tener la interfaz Producto
  @Output() productoSeleccionado = new EventEmitter<any>();

  readonly _dialog = inject(MatDialog);
  readonly _dialogRef = inject(MatDialogRef<BuscarProductoDialogoComponent>);
  private _destroyRef = inject(DestroyRef);
  
  // Recibimos los productos que ya estaban seleccionados en la vista padre
  readonly data = inject<{ productos: any[] }>(MAT_DIALOG_DATA);

  productos = signal<any[]>([]);
  tablaLoading = signal(false);
  tablaPaginacion = signal<PageEvent>({
    pageIndex: 0,
    pageSize: 5,
    length: 0,
  });
  
  tablaColumnas: string[] = ['item', 'producto', 'categoria', 'precio'];
  tablaData = signal<any[]>([]);
  tablaIndex = signal<number>(0);

  busquedaControl = new FormControl('');
  categoriaControl = new FormControl('');

  categorias = ['Todas', 'Chocolates', 'Snacks', 'Bebidas', 'Galletas', 'Caramelos'];

  // --- MOCK DATA: GOLOSINAS ---
  private readonly MOCK_PRODUCTOS = [
    { id: 'P001', codigo: 'CHO-001', nombre: 'Chocolate Sublime Clásico', categoria: 'Chocolates', precio: 1.50 },
    { id: 'P002', codigo: 'CHO-002', nombre: 'Triángulo D\'Onofrio', categoria: 'Chocolates', precio: 2.00 },
    { id: 'P003', codigo: 'SNK-001', nombre: 'Papitas Lays Clásicas', categoria: 'Snacks', precio: 2.50 },
    { id: 'P004', codigo: 'SNK-002', nombre: 'Doritos Queso', categoria: 'Snacks', precio: 2.80 },
    { id: 'P005', codigo: 'BEB-001', nombre: 'Inca Kola Personal 500ml', categoria: 'Bebidas', precio: 3.00 },
    { id: 'P006', codigo: 'BEB-002', Coca: 'Agua San Mateo 600ml', nombre: 'Agua San Mateo 600ml', categoria: 'Bebidas', precio: 2.00 },
    { id: 'P007', codigo: 'GAL-001', nombre: 'Galletas Oreo', categoria: 'Galletas', precio: 1.20 },
    { id: 'P008', codigo: 'GAL-002', nombre: 'Galletas Casino Fresa', categoria: 'Galletas', precio: 1.00 },
    { id: 'P009', codigo: 'CAR-001', nombre: 'Halls Mentolado', categoria: 'Caramelos', precio: 1.50 },
    { id: 'P010', codigo: 'CAR-002', nombre: 'Gomitas Ambrosoli', categoria: 'Caramelos', precio: 2.50 },
  ];

  ngOnInit() {
    // Cargamos los productos que el padre ya tenía seleccionados para pintarlos de verde
    this.productos.set(this.data?.productos ?? []);

    this.handleFiltro(); // Carga inicial

    this.busquedaControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe(() => this.handleFiltro());

    this.categoriaControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.tablaPaginacion.update(p => ({ ...p, pageIndex: 0 }));
        this.handleFiltro();
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
      const producto = data[current];
      if (producto) {
        this.seleccionarProducto(producto);
      }
      return;
    }
  }

  // --- Lógica estática de Filtrado y Paginación ---
  handleFiltro() {
    this.tablaLoading.set(true);

    setTimeout(() => {
      const termino = (this.busquedaControl.value || '').toLowerCase();
      const categoria = this.categoriaControl.value;

      // Filtrar
      let filtrados = this.MOCK_PRODUCTOS.filter(p => 
        (p.nombre.toLowerCase().includes(termino) || p.codigo.toLowerCase().includes(termino)) &&
        (!categoria || categoria === 'Todas' || p.categoria === categoria)
      );

      // Paginar localmente
      const startIndex = this.tablaPaginacion().pageIndex * this.tablaPaginacion().pageSize;
      const paginados = filtrados.slice(startIndex, startIndex + this.tablaPaginacion().pageSize);

      this.tablaData.set(paginados);
      this.tablaPaginacion.update(p => ({ ...p, length: filtrados.length }));
      this.tablaIndex.set(0);
      this.tablaLoading.set(false);
    }, 300); // Pequeño retraso simulando API
  }

  handlePageEvent(e: PageEvent) {
    this.tablaPaginacion.set(e);
    this.handleFiltro();
  }

  // Verifica si el producto ya está en la lista de seleccionados
  someProducto(producto: any) {
    return this.productos().some((p) => p.id === producto.id);
  }

  // Agrega o quita el producto de la lista local y avisa al padre
  seleccionarProducto(producto: any) {
    this.productos.update((lista) => {
      const existe = lista.some((p) => p.id === producto.id);
      return existe
        ? lista.filter((p) => p.id !== producto.id)
        : [...lista, producto];
    });
    
    // Emitimos el producto tocado para que el padre (crear.component) lo procese
    this.productoSeleccionado.emit(producto);
  }
}