import { Component, computed, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { UnitMeasureFormModel } from '../../infrastructure/dtos/unit-measure-form.dto';
import { form, required, FormRoot, FormField, maxLength } from '@angular/forms/signals';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { UnitMeasureFacade } from '../../application/facades/unit-measure.facade';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { UnitMeasure } from '../../domain/models/unit-measure.model';

@Component({
  selector: 'app-unit-measure-form-dialog',
  imports: [
    FormRoot,
    FormField,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmInputGroupImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ data ? 'Editar' : 'Crear' }} Unidad de Medida</h3>
      <p hlmDialogDescription>
        Complete los campos para {{ data ? 'editar la' : 'crear una nueva' }} unidad de medida.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create-unit-measure">
        <hlm-field-group>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel for="code">Código</label>
              <input id="code" hlmInput autoComplete="off" [formField]="form.code" />

              @for (error of form.code().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="name">Nombre</label>
              <input id="name" hlmInput autoComplete="off" [formField]="form.name" />

              @for (error of form.name().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="taxCode">Código tributario</label>
              <input id="taxCode" hlmInput autoComplete="off" [formField]="form.taxCode" />

              @for (error of form.taxCode().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="symbol">Símbolo</label>
              <input id="symbol" hlmInput autoComplete="off" [formField]="form.symbol" />

              @for (error of form.symbol().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>
          </div>
          <hlm-field>
            <label hlmFieldLabel for="description">Descripción</label>
            <hlm-input-group>
              <textarea
                hlmInputGroupTextarea
                id="description"
                class="min-h-24"
                rows="4"
                [formField]="form.description"
              ></textarea>
              <hlm-input-group-addon align="block-end">
                <span hlmInputGroupText>{{ descriptionLength() }}/150 caracteres</span>
              </hlm-input-group-addon>
            </hlm-input-group>

            @for (error of form.description().errors(); track error) {
              <hlm-field-error [validator]="error.kind">
                {{ error.message }}
              </hlm-field-error>
            }
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
        Cerrar
      </button>
      <button hlmBtn type="submit" form="form-create-unit-measure" [disabled]="form().submitting()">
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class UnitMeasureCreateDialog {
  private readonly unitMeasureFacade = inject(UnitMeasureFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  private readonly _dialogContext = injectBrnDialogContext<{ unitMeasure: UnitMeasure }>();
  protected readonly data = this._dialogContext.unitMeasure;

  protected readonly formModel = signal<UnitMeasureFormModel>({
    code: this.data?.code ?? '',
    name: this.data?.name ?? '',
    taxCode: this.data?.taxCode ?? '',
    symbol: this.data?.symbol ?? '',
    description: this.data?.description ?? '',
  });

  public readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.code, { message: 'El campo es requerido' });
      required(schema.name, { message: 'El campo es requerido' });
      required(schema.taxCode, { message: 'El campo es requerido' });
      required(schema.symbol, { message: 'El campo es requerido' });
      maxLength(schema.description, 150, {
        message: 'La descripción no puede exceder 150 caracteres',
      });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const fields = field().value();
            const response = this.data
              ? await this.unitMeasureFacade.update({
                  ...this.data,
                  code: fields.code,
                  name: fields.name,
                  taxCode: fields.taxCode,
                  symbol: fields.symbol,
                  description: fields.description,
                })
              : await this.unitMeasureFacade.create(fields);
            toast.success(response.message);
            this.close();
          } catch (err: any) {
            toast.error(parseHttpError(err));
          }
        },
      },
    },
  );

  public readonly descriptionLength = computed(() => this.form.description().value().length);

  public close() {
    this.dialogRef.close();
  }
}
