import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuscarProductoDialogoComponent } from '../../caja/buscar-producto-dialog/buscar-producto-dialog';


@Component({
  selector: 'app-nueva-transferencia-dialog',
  templateUrl: './nueva-transferencia-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, 
    MatInputModule, FormsModule, MatTooltipModule
  ]
})
export class NuevaTransferenciaDialogoComponent {
  readonly _dialogRef = inject(MatDialogRef<NuevaTransferenciaDialogoComponent>);
  readonly _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  // Lista de productos solicitados
  items = signal<any[]>([]);

  // Abre el catálogo de productos para añadir a la solicitud
  abrirBuscadorProductos() {
    const dialogRef = this._dialog.open(BuscarProductoDialogoComponent, {
      panelClass: 'mat-dialog-lg',
      width: '800px',
      // Le pasamos los productos que ya están en la lista para que aparezcan marcados
      data: { productos: this.items().map(i => i.producto) }
    });

    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.productoSeleccionado.subscribe((productoSel: any) => {
        this.items.update(listaActual => {
          const existe = listaActual.find(item => item.producto.id === productoSel.id);
          
          if (existe) {
            // Si ya existe, lo quitamos de la lista
            return listaActual.filter(item => item.producto.id !== productoSel.id);
          } else {
            // Si no existe, lo agregamos con cantidad solicitada 1 por defecto
            return [...listaActual, { producto: productoSel, cantidadSolicitada: 1 }];
          }
        });
      });
    });
  }

  actualizarCantidad(item: any, nuevaCantidad: number | string) {
    let cant = Number(nuevaCantidad);
    if (isNaN(cant) || cant <= 0) cant = 1;

    // Validación opcional: No pedir más de lo que hay en almacén
    if (cant > item.producto.stockAlmacen) {
      this._snackBar.open(`Solo hay ${item.producto.stockAlmacen} en Almacén`, 'Cerrar', { duration: 3000 });
      cant = item.producto.stockAlmacen;
    }

    this.items.update(lista => 
      lista.map(i => i.producto.id === item.producto.id ? { ...i, cantidadSolicitada: cant } : i)
    );
  }

  eliminarItem(item: any) {
    this.items.update(lista => lista.filter(i => i.producto.id !== item.producto.id));
  }

  enviarSolicitud() {
    if (this.items().length === 0) {
      this._snackBar.open('Debes agregar al menos un producto a la solicitud', 'Cerrar', { duration: 3000 });
      return;
    }

    // Formateamos la data para que coincida con lo que espera la tabla principal
    const nuevaSolicitud = {
      id: 'TR-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      fecha: new Date(),
      solicitante: 'Vendedora (Tú)', // En un sistema real saldría del AuthService
      rolSolicitante: 'VENDEDORA',
      origen: 'ALMACÉN CENTRAL',
      destino: 'MOSTRADOR 01',
      itemsCount: this.items().length,
      estado: 'SOLICITADO',
      detalle: this.items().map(i => ({
        producto: i.producto.nombre,
        cant: i.cantidadSolicitada
      }))
    };

    this._dialogRef.close(nuevaSolicitud);
  }
}