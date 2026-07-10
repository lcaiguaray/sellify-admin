import { Component, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { ContactFormModel } from '../../infrastructure/dtos/contact-form.dto';
import { form, required, FormRoot, FormField } from '@angular/forms/signals';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { ContactFacade } from '../../application/facades/contact.facade';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { Contact } from '../../domain/models/contact.model';
import { HlmCheckboxImports } from '@ui-spartan/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form-dialog',
  imports: [
    FormsModule,
    FormRoot,
    FormField,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmNativeSelectImports,
    HlmCheckboxImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ data ? 'Editar' : 'Nuevo' }} Contacto</h3>
      <p hlmDialogDescription>
        Ingrese los datos de la persona o entidad y asigne sus roles.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create-contact">
        <hlm-field-group>
          <!-- Roles -->
          <div class="mb-4 p-4 rounded-lg border border-border bg-muted/20">
            <h4 class="text-sm font-semibold mb-3">Roles asignados (Puedes elegir varios)</h4>
            <div class="flex gap-6 flex-wrap">
              <label class="flex items-center gap-2 cursor-pointer">
                <hlm-checkbox [formField]="form.isCustomer" />
                <span>Es Cliente</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <hlm-checkbox [formField]="form.isProvider" />
                <span>Es Proveedor</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <hlm-checkbox [formField]="form.isEmployee" />
                <span>Es Trabajador</span>
              </label>
            </div>
            @if(!form.isCustomer().value() && !form.isProvider().value() && !form.isEmployee().value()) {
              <span class="text-xs text-destructive mt-2 block">
                Debe seleccionar al menos un rol.
              </span>
            }
          </div>

          <!-- Basic Data -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel>Tipo Documento</label>
              <select hlmNativeSelect [formField]="form.documentType">
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carnet Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="OTROS">Otros</option>
              </select>
              @for (error of form.documentType().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel for="documentNumber">Número Documento</label>
              <input id="documentNumber" hlmInput autoComplete="off" [formField]="form.documentNumber" />
              @for (error of form.documentNumber().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </div>

          <hlm-field>
            <label hlmFieldLabel for="name">Nombres / Razón Social</label>
            <input id="name" hlmInput autoComplete="off" [formField]="form.name" />
            @for (error of form.name().errors(); track error) {
              <hlm-field-error [validator]="error.kind">
                {{ error.message }}
              </hlm-field-error>
            }
          </hlm-field>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel for="email">Correo Electrónico (Opcional)</label>
              <input id="email" hlmInput type="email" autoComplete="off" [formField]="form.email" />
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel for="phone">Teléfono (Opcional)</label>
              <input id="phone" hlmInput autoComplete="off" [formField]="form.phone" />
            </hlm-field>
          </div>

          <hlm-field>
            <label hlmFieldLabel for="address">Dirección (Opcional)</label>
            <input id="address" hlmInput autoComplete="off" [formField]="form.address" />
          </hlm-field>

        </hlm-field-group>
      </form>
    </div>
    <hlm-dialog-footer>
      <button
        hlmBtn
        type="button"
        variant="outline"
        (click)="close()"
        [disabled]="form().submitting()"
      >
        Cancelar
      </button>
      <button 
        hlmBtn 
        type="submit" 
        form="form-create-contact" 
        [disabled]="form().submitting() || (!form.isCustomer().value() && !form.isProvider().value() && !form.isEmployee().value())"
      >
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class ContactCreateDialog {
  private readonly contactFacade = inject(ContactFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  private readonly _dialogContext = injectBrnDialogContext<{ contact: Contact }>();
  protected readonly data = this._dialogContext.contact;

  protected readonly formModel = signal<ContactFormModel>({
    documentType: this.data?.documentType ?? 'DNI',
    documentNumber: this.data?.documentNumber ?? '',
    name: this.data?.name ?? '',
    email: this.data?.email ?? '',
    phone: this.data?.phone ?? '',
    address: this.data?.address ?? '',
    isCustomer: this.data?.isCustomer ?? false,
    isProvider: this.data?.isProvider ?? false,
    isEmployee: this.data?.isEmployee ?? false,
  });

  public readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.documentType, { message: 'El tipo es requerido' });
      required(schema.documentNumber, { message: 'El número es requerido' });
      required(schema.name, { message: 'El nombre es requerido' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const fields = field().value();
            
            if (!fields.isCustomer && !fields.isProvider && !fields.isEmployee) {
              toast.error('Debe seleccionar al menos un rol');
              return;
            }

            const response = this.data
              ? await this.contactFacade.update({
                  ...this.data,
                  ...fields,
                })
              : await this.contactFacade.create(fields);
            toast.success(response.message);
            this.close();
          } catch (err: any) {
            toast.error(parseHttpError(err));
          }
        },
      },
    },
  );

  public close() {
    this.dialogRef.close();
  }
}
