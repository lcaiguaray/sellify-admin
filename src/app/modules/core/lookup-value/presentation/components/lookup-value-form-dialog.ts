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
import { LookupValueFacade } from '../../application/facades/lookup-value.facade';
import { LookupValueFormModel } from '../../infrastructure/dtos/lookup-value-form.dto';

@Component({
  selector: 'app-lookup-value-form-dialog',
  imports: [FormRoot, FormField, HlmButtonImports, HlmDialogImports, HlmFieldImports, HlmInputImports, HlmInputGroupImports, HlmSpinner],
  host: { class: 'flex flex-col gap-4' },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Crear valor</h3>
      <p hlmDialogDescription>Catálogo: {{ lookupGroupId }}</p>
    </hlm-dialog-header>
    <form [formRoot]="valueForm" id="lookup-value-form">
      <hlm-field-group>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <hlm-field>
            <label hlmFieldLabel for="lookup-code">Código</label>
            <input id="lookup-code" hlmInput autocomplete="off" [formField]="valueForm.code" (input)="uppercaseCode()" />
            @for (error of valueForm.code().errors(); track error) {
              <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
            }
          </hlm-field>
          <hlm-field>
            <label hlmFieldLabel for="lookup-name">Nombre</label>
            <input id="lookup-name" hlmInput autocomplete="off" [formField]="valueForm.name" />
            @for (error of valueForm.name().errors(); track error) {
              <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
            }
          </hlm-field>
        </div>
        <hlm-field>
          <label hlmFieldLabel for="lookup-description">Descripción</label>
          <hlm-input-group>
            <textarea id="lookup-description" hlmInputGroupTextarea rows="4" class="min-h-24" [formField]="valueForm.description"></textarea>
            <hlm-input-group-addon align="block-end"><span hlmInputGroupText>{{ descriptionLength() }}/200 caracteres</span></hlm-input-group-addon>
          </hlm-input-group>
        </hlm-field>
      </hlm-field-group>
    </form>
    <hlm-dialog-footer>
      <button hlmBtn variant="outline" type="button" (click)="close()" [disabled]="valueForm().submitting()">Cerrar</button>
      <button hlmBtn type="submit" form="lookup-value-form" [disabled]="valueForm().submitting()">
        @if (valueForm().submitting()) { <hlm-spinner data-icon="inline-start" /> } Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class LookupValueFormDialog {
  private readonly facade = inject(LookupValueFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);
  private readonly context = injectBrnDialogContext<{ lookupGroupId: string }>();
  protected readonly lookupGroupId = this.context.lookupGroupId;
  private readonly model = signal<LookupValueFormModel>({
    code: '',
    name: '',
    description: '',
  });
  readonly valueForm = form(
    this.model,
    (schema) => {
      required(schema.code, { message: 'El campo es requerido' });
      maxLength(schema.code, 20, { message: 'Máximo 20 caracteres' });
      required(schema.name, { message: 'El campo es requerido' });
      maxLength(schema.description, 200, { message: 'Máximo 200 caracteres' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const values = field().value();
            const response = await this.facade.create({
              lookupGroupId: this.lookupGroupId,
              code: values.code,
              name: values.name,
              description: values.description || null,
              attributes: {},
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
  readonly descriptionLength = computed(() => this.valueForm.description().value().length);
  uppercaseCode(): void {
    const normalized = this.valueForm.code().value().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    this.valueForm.code().value.set(normalized);
  }
  close(): void { this.dialogRef.close(); }
}
