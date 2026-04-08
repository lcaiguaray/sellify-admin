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

  items = signal<any[]>([]);

  abrirBuscadorProductos() {
    const dialogRef = this._dialog.open(BuscarProductoDialogoComponent, {
      panelClass: 'mat-dialog-lg',
      width: '800px',
      data: { productos: this.items().map(i => i.producto) }
    });

    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.productoSeleccionado.subscribe((productoSel: any) => {
        this.items.update(listaActual => {
          const existe = listaActual.find(item => item.producto.id === productoSel.id);
          
          if (existe) {
            return listaActual.filter(item => item.producto.id !== productoSel.id);
          } else {
            return [...listaActual, { producto: productoSel, cantidadSolicitada: 1 }];
          }
        });
      });
    });
  }

  actualizarCantidad(item: any, nuevaCantidad: number | string) {
    let cant = Number(nuevaCantidad);
    if (isNaN(cant) || cant <= 0) cant = 1;

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

    const nuevaSolicitud = {
      id: 'TR-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      fecha: new Date(),
      solicitante: 'Vendedora (Tú)', 
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