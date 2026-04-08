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
import { PersonaDialogComponent } from '../persona-dialog/persona-dialog.component';
import { AlertDialogComponent } from '@app/features/components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RouterLink
  ]
})
export default class PersonaComponent implements OnInit {
  readonly _dialog = inject(MatDialog);

  busquedaControl = new FormControl('');
  tablaLoading = signal(false);
  tablaData = signal<any[]>([]);
  
  tablaColumnas: string[] = ['item', 'nombres', 'documento', 'roles', 'acciones'];

  tablaPaginacion = signal<PageEvent>({
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  });

  private mockPersonas: any[] = [
    { id: 'PER-001', nombres: 'Jimmy', apellidoPaterno: 'Dev', apellidoMaterno: '', tipoDocumento: 'DNI', documento: '12345678', roles: ['ADMINISTRADOR', 'VENDEDOR'] },
    { id: 'PER-002', nombres: 'María', apellidoPaterno: 'López', apellidoMaterno: 'Díaz', tipoDocumento: 'DNI', documento: '87654321', roles: ['CLIENTE'] },
    { id: 'PER-003', nombres: 'Distribuidora', apellidoPaterno: 'S.A.C.', apellidoMaterno: '', tipoDocumento: 'RUC', documento: '20123456789', roles: ['PROVEEDOR', 'CLIENTE'] },
  ];

  ngOnInit() {
    this.cargarDatos();

    this.busquedaControl.valueChanges.subscribe((term) => {
      this.filtrarDatos(term || '');
    });
  }

  cargarDatos() {
    this.tablaData.set([...this.mockPersonas]);
    this.tablaPaginacion.update(p => ({ ...p, length: this.mockPersonas.length }));
  }

  filtrarDatos(term: string) {
    const busqueda = term.toLowerCase();
    const filtrados = this.mockPersonas.filter(p => 
      `${p.nombres} ${p.apellidoPaterno} ${p.documento}`.toLowerCase().includes(busqueda)
    );
    this.tablaData.set(filtrados);
  }

  getNombreCompleto(p: any): string {
    return `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}`.trim();
  }

  abrirDialogo(persona?: any) {
    const dialogRef = this._dialog.open(PersonaDialogComponent, {
      panelClass: 'mat-dialog-lg',
      width: '800px',
      data: { persona: persona }, 
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        if (persona) {
          const index = this.mockPersonas.findIndex(p => p.id === resultado.id);
          if (index !== -1) this.mockPersonas[index] = resultado;
          alert('Persona actualizada correctamente');
        } else {
          this.mockPersonas.unshift(resultado); 
          alert('Persona registrada correctamente');
        }
        this.cargarDatos(); 
      }
    });
  }

  eliminar(persona: any) {
    const dialogRef = this._dialog.open(AlertDialogComponent, {
    width: '450px',
    data: {
      tipo: 'confirm',
      titulo: 'Confirmar Eliminación',
      mensaje: `¿Deseas eliminar a ${persona.nombres} de la base de datos? Se perderá su historial de roles.`,
      textoConfirmar: 'Sí, eliminar',
      textoCancelar: 'No, mantener',
      colorConfirmar: 'warn'
    }
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.mockPersonas = this.mockPersonas.filter(p => p.id !== persona.id);
      this.cargarDatos();
    }
  });
  }

  handlePageEvent(e: PageEvent) {
    this.tablaPaginacion.set(e);
  }
}