import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { parseHttpError } from '@core/utils/http-error.util';
import { LookupValueRepository, createLookupValueSearchable } from '@modules/core/lookup-value';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';
import { HlmSpinner } from '@ui-spartan/spinner';
import { UserFacade } from '../../application/facades/user.facade';
import { UserFormModel } from '../../infrastructure/dtos/user-form.dto';

@Component({
  selector: 'app-user-form-dialog',
  imports: [FormRoot, FormField, HlmButtonImports, HlmDialogImports, HlmFieldImports, HlmInputImports, HlmNativeSelectImports, HlmSpinner],
  host: { class: 'flex flex-col gap-4' },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Crear usuario</h3>
      <p hlmDialogDescription>El documento será el usuario y la contraseña inicial.</p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="userForm" id="user-form">
        <hlm-field-group>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel for="document-type">Tipo de documento</label>
              <select id="document-type" hlmNativeSelect [formField]="userForm.documentTypeId">
                <option value="" disabled>Seleccione un tipo</option>
                @for (type of documentTypes(); track type.id) {
                  <option [value]="type.id">{{ type.name }}</option>
                }
              </select>
              @for (error of userForm.documentTypeId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="tax-id">Número de documento</label>
              <input id="tax-id" hlmInput autocomplete="off" [formField]="userForm.taxId" />
              @for (error of userForm.taxId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="first-name">Nombres</label>
              <input id="first-name" hlmInput autocomplete="off" [formField]="userForm.firstName" />
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="last-name">Apellidos</label>
              <input id="last-name" hlmInput autocomplete="off" [formField]="userForm.lastName" />
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="business-name">Razón social</label>
              <input id="business-name" hlmInput autocomplete="off" [formField]="userForm.businessName" />
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="trade-name">Nombre comercial</label>
              <input id="trade-name" hlmInput autocomplete="off" [formField]="userForm.tradeName" />
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="email">Correo</label>
              <input id="email" hlmInput type="email" autocomplete="off" [formField]="userForm.email" />
              @for (error of userForm.email().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="phone">Teléfono</label>
              <input id="phone" hlmInput autocomplete="off" [formField]="userForm.phone" />
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="inception-date">Fecha de nacimiento / inicio</label>
              <input id="inception-date" hlmInput type="date" [formField]="userForm.inceptionDate" />
            </hlm-field>
          </div>
        </hlm-field-group>
      </form>
    </div>
    <hlm-dialog-footer>
      <button hlmBtn variant="outline" type="button" (click)="close()" [disabled]="userForm().submitting()">Cerrar</button>
      <button hlmBtn type="submit" form="user-form" [disabled]="userForm().submitting()">
        @if (userForm().submitting()) { <hlm-spinner data-icon="inline-start" /> } Crear usuario
      </button>
    </hlm-dialog-footer>
  `,
})
export class UserFormDialog {
  private readonly facade = inject(UserFacade);
  private readonly lookupValues = inject(LookupValueRepository);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);
  readonly documentTypesResource = rxResource({
    stream: () => this.lookupValues.get({ ...createLookupValueSearchable('DOCUMENT_TYPE'), active: true, size: 100 }).pipe(map((response) => response.data.content)),
  });
  readonly documentTypes = () => this.documentTypesResource.value() ?? [];
  private readonly model = signal<UserFormModel>({
    documentTypeId: '',
    taxId: '',
    firstName: '',
    lastName: '',
    businessName: '',
    tradeName: '',
    email: '',
    phone: '',
    inceptionDate: '',
  });
  readonly userForm = form(
    this.model,
    (schema) => {
      required(schema.documentTypeId, { message: 'El campo es requerido' });
      required(schema.taxId, { message: 'El campo es requerido' });
      required(schema.email, { message: 'El campo es requerido' });
      email(schema.email, { message: 'Ingrese un correo válido' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const values = field().value();
            const response = await this.facade.create({ ...values, identityId: null, inceptionDate: values.inceptionDate || null });
            toast.success(response.message);
            this.close();
          } catch (error) {
            toast.error(parseHttpError(error));
          }
        },
      },
    },
  );
  close(): void { this.dialogRef.close(); }
}
