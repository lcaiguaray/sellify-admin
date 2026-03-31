import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ProductoDialogComponent } from '../producto-dialog/producto-dialog.component';
import { ConvertirStockDialogComponent } from '../convertir-stock-dialog/convertir-stock-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '@app/features/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatTooltipModule, RouterLink, MatSnackBarModule
  ]
})
export default class ProductoComponent implements OnInit {
  readonly _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  busquedaControl = new FormControl('');
  tablaData = signal<any[]>([]);
  
  tablaColumnas: string[] = ['codigo', 'nombre', 'categoria', 'stock', 'precio', 'acciones'];

  tablaPaginacion = signal<PageEvent>({ pageIndex: 0, pageSize: 10, length: 0 });

  // --- MOCK DATA CON EQUIVALENCIAS ---
  private mockProductos: any[] = [
    { 
      id: 'PROD-001', codigo: 'CHO-001', nombre: 'Chocolate Sublime Clásico', categoria: 'Chocolates', 
      unidadBase: 'UNIDAD', stockBase: 48, precioBase: 1.50,
      equivalencias: [{ unidad: 'CAJA', factor: 24, precio: 30.00, stock: 2 }] // 2 Cajas en stock
    },
    { 
      id: 'PROD-002', codigo: 'GAL-001', nombre: 'Galletas Oreo', categoria: 'Galletas', 
      unidadBase: 'UNIDAD', stockBase: 12, precioBase: 1.20,
      equivalencias: [{ unidad: 'PAQUETE', factor: 6, precio: 6.50, stock: 5 }] // 5 Paquetes de 6 en stock
    },
    { 
      id: 'PROD-003', codigo: 'CAR-001', nombre: 'Caramelos Limón', categoria: 'Caramelos', 
      unidadBase: 'UNIDAD', stockBase: 150, precioBase: 0.20,
      equivalencias: [{ unidad: 'BOLSA', factor: 100, precio: 15.00, stock: 1 }] // 1 Bolsa de 100 en stock
    },
  ];

  ngOnInit() {
    this.cargarDatos();
    this.busquedaControl.valueChanges.subscribe(term => this.filtrarDatos(term || ''));
  }

  cargarDatos() {
    this.tablaData.set([...this.mockProductos]);
    this.tablaPaginacion.update(p => ({ ...p, length: this.mockProductos.length }));
  }

  filtrarDatos(term: string) {
    const busqueda = term.toLowerCase();
    const filtrados = this.mockProductos.filter(p => 
      `${p.nombre} ${p.codigo} ${p.categoria}`.toLowerCase().includes(busqueda)
    );
    this.tablaData.set(filtrados);
  }

  abrirDialogo(producto?: any) {
    const dialogRef = this._dialog.open(ProductoDialogComponent, {
      panelClass: 'mat-dialog-lg', width: '900px', data: { producto }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (producto) {
          const index = this.mockProductos.findIndex(p => p.id === res.id);
          if (index !== -1) this.mockProductos[index] = res;
          // REEMPLAZO DEL TOAST SUCCESS
          this._snackBar.open('Producto actualizado correctamente', 'Cerrar', { duration: 3000 });
        } else {
          this.mockProductos.unshift(res);
          // REEMPLAZO DEL TOAST SUCCESS
          this._snackBar.open('Producto registrado correctamente', 'Cerrar', { duration: 3000 });
        }
        this.cargarDatos();
      }
    });
  }

  abrirConversor(producto: any) {
    const dialogRef = this._dialog.open(ConvertirStockDialogComponent, {
      panelClass: 'mat-dialog-md', width: '500px', data: { producto }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // En un caso real, aquí llamas a tu API. Por ahora actualizamos el mock local.
        const index = this.mockProductos.findIndex(p => p.id === producto.id);
        if (index !== -1) {
          this.mockProductos[index] = res.productoActualizado;
          this.cargarDatos();
        }
      }
    });
  }

  eliminar(producto: any) {
    const dialogRef = this._dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Eliminar Producto',
        mensaje: `¿Estás seguro de eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`,
        textoBoton: 'Eliminar',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.mockProductos = this.mockProductos.filter(p => p.id !== producto.id);
        this.cargarDatos();
        // REEMPLAZO DEL TOAST INFO
        this._snackBar.open('El producto ha sido eliminado', 'Cerrar', { duration: 3000 }); 
      }
    });
  }

  handlePageEvent(e: PageEvent) { this.tablaPaginacion.set(e); }
}