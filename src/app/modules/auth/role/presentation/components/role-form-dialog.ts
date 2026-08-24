import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, required } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { HlmSpinner } from '@ui-spartan/spinner';
import { Role } from '../../domain/models/role.model';
import { RoleFacade } from '../../application/facades/role.facade';
import { RoleFormModel } from '../../infrastructure/dtos/role-form.dto';

@Component({
  selector: 'app-role-form-dialog',
  imports: [
    FormRoot,
    FormField,
    HlmButtonImports,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmSpinner,
  ],
  host: { class: 'flex flex-col gap-4' },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ role ? 'Editar' : 'Crear' }} rol</h3>
      <p hlmDialogDescription>Defina el nombre y propósito del rol dentro de la empresa.</p>
    </hlm-dialog-header>

    <form [formRoot]="roleForm" id="role-form">
      <hlm-field-group>
        <hlm-field>
          <label hlmFieldLabel for="role-name">Nombre</label>
          <input id="role-name" hlmInput autocomplete="off" [formField]="roleForm.name" />
          @for (error of roleForm.name().errors(); track error) {
            <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
          }
        </hlm-field>

        <hlm-field>
          <label hlmFieldLabel for="role-description">Descripción</label>
          <hlm-input-group>
            <textarea
              id="role-description"
              hlmInputGroupTextarea
              rows="4"
              class="min-h-24"
              [formField]="roleForm.description"
            ></textarea>
            <hlm-input-group-addon align="block-end">
              <span hlmInputGroupText>{{ descriptionLength() }}/200 caracteres</span>
            </hlm-input-group-addon>
          </hlm-input-group>
          @for (error of roleForm.description().errors(); track error) {
            <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
          }
        </hlm-field>
      </hlm-field-group>
    </form>

    <hlm-dialog-footer>
      <button hlmBtn variant="outline" type="button" (click)="close()" [disabled]="roleForm().submitting()">
        Cerrar
      </button>
      <button hlmBtn type="submit" form="role-form" [disabled]="roleForm().submitting()">
        @if (roleForm().submitting()) { <hlm-spinner data-icon="inline-start" /> }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class RoleFormDialog {
  private readonly facade = inject(RoleFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);
  private readonly context = injectBrnDialogContext<{ role: Role | null }>();
  protected readonly role = this.context.role;

  private readonly model = signal<RoleFormModel>({
    name: this.role?.name ?? '',
    description: this.role?.description ?? '',
  });

  readonly roleForm = form(
    this.model,
    (schema) => {
      required(schema.name, { message: 'El campo es requerido' });
      maxLength(schema.description, 200, { message: 'Máximo 200 caracteres' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const values = field().value();
            const response = this.role
              ? await this.facade.update({
                  ...this.role,
                  name: values.name,
                  description: values.description || null,
                })
              : await this.facade.create({
                  name: values.name,
                  description: values.description || null,
                });
            toast.success(response.message);
            this.close();
          } catch (error) {
            toast.error(parseHttpError(error));
          }
        },
      },
    },
  );

  readonly descriptionLength = computed(() => this.roleForm.description().value().length);

  close(): void {
    this.dialogRef.close();
  }
}
