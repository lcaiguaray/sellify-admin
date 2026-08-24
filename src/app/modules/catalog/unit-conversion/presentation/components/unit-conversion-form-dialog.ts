import { Component, computed, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { UnitConversionFormModel } from '../../infrastructure/dtos/unit-conversion-form.dto';
import { form, required, FormRoot, FormField, min } from '@angular/forms/signals';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { UnitConversionFacade } from '../../application/facades/unit-conversion.facade';
import { UnitMeasureFacade } from '@modules/catalog/unit-measure';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { UnitConversion } from '../../domain/models/unit-conversion.model';
import { ProductFacade } from '@modules/catalog/product';
import { AuthFacade } from '@modules/auth';

@Component({
  selector: 'app-unit-conversion-form-dialog',
  imports: [
    FormRoot,
    FormField,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmNativeSelectImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ data ? 'Editar' : 'Crear' }} Conversión de Unidades</h3>
      <p hlmDialogDescription>Especifique el factor de conversión entre dos unidades.</p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create-unit-conversion">
        <hlm-field-group>
          @if (data) {
            <div class="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p class="text-sm font-medium">{{ data.productName || 'Conversión general' }}</p>
              <p class="text-xs text-muted-foreground">
                La asociación al producto se conserva durante la edición.
              </p>
            </div>
          } @else if (canReadProducts()) {
            <hlm-field>
              <label hlmFieldLabel>Producto (opcional)</label>
              <select hlmNativeSelect [formField]="form.productId">
                <option value="">Conversión general</option>
                @for (product of products(); track product.id) {
                  <option [value]="product.id">{{ product.name }}</option>
                }
              </select>
              <span class="mt-1 text-xs text-muted-foreground">
                Seleccione un producto cuando la equivalencia sea específica para él.
              </span>
            </hlm-field>
          } @else {
            <div class="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p class="text-sm font-medium">Conversión general</p>
              <p class="text-xs text-muted-foreground">
                No dispone del permiso necesario para consultar productos.
              </p>
            </div>
          }

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel>De (Unidad Mayor)</label>
              <select hlmNativeSelect [formField]="form.fromUnitId">
                <option value="" disabled>Seleccione una unidad</option>
                @for (unit of unitMeasures(); track unit.id) {
                  <option [value]="unit.id">{{ unit.name }}</option>
                }
              </select>

              @for (error of form.fromUnitId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel>A (Unidad Menor)</label>
              <select hlmNativeSelect [formField]="form.toUnitId">
                <option value="" disabled>Seleccione una unidad</option>
                @for (unit of unitMeasures(); track unit.id) {
                  <option [value]="unit.id">{{ unit.name }}</option>
                }
              </select>

              @for (error of form.toUnitId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </div>

          <hlm-field>
            <label hlmFieldLabel for="factor">Factor de Conversión</label>
            <input
              id="factor"
              hlmInput
              type="number"
              step="any"
              autoComplete="off"
              [formField]="form.factor"
              placeholder="Ej. 12 (1 Caja = 12 Unidades)"
            />
            <span class="text-xs text-muted-foreground mt-1">
              Cantidad de la unidad menor que caben en la unidad mayor.
            </span>

            @for (error of form.factor().errors(); track error) {
              <hlm-field-error [validator]="error.kind">
                {{ error.message }}
              </hlm-field-error>
            }
          </hlm-field>

          @if (conversionSummary()) {
            <div class="p-4 bg-muted/50 rounded-lg border border-border mt-2">
              <h4 class="text-sm font-semibold mb-1">Vista previa</h4>
              <p class="text-sm text-muted-foreground">{{ conversionSummary() }}</p>
            </div>
          }
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
      <button
        hlmBtn
        type="submit"
        form="form-create-unit-conversion"
        [disabled]="form().submitting()"
      >
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class UnitConversionCreateDialog {
  private readonly conversionFacade = inject(UnitConversionFacade);
  private readonly unitMeasureFacade = inject(UnitMeasureFacade);
  private readonly productFacade = inject(ProductFacade);
  private readonly auth = inject(AuthFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  readonly unitMeasures = this.unitMeasureFacade.data;
  readonly products = this.productFacade.data;
  readonly canReadProducts = computed(() => this.auth.hasPermission('PRODUCT.READ'));

  private readonly _dialogContext = injectBrnDialogContext<{ conversion: UnitConversion }>();
  protected readonly data = this._dialogContext.conversion;

  protected readonly formModel = signal<UnitConversionFormModel>({
    productId: this.data?.productId ?? '',
    fromUnitId: this.data?.fromUnitId ?? '',
    toUnitId: this.data?.toUnitId ?? '',
    factor: this.data?.factor ?? 1,
  });

  public readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.fromUnitId, { message: 'El campo es requerido' });
      required(schema.toUnitId, { message: 'El campo es requerido' });
      required(schema.factor, { message: 'El campo es requerido' });
      min(schema.factor, 0.0001, { message: 'El factor debe ser mayor a 0' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const fields = field().value();
            if (fields.fromUnitId === fields.toUnitId) {
              toast.error('La unidad de origen y destino no pueden ser iguales.');
              return;
            }

            const response = this.data
              ? await this.conversionFacade.update({
                  ...this.data,
                  productId: fields.productId,
                  fromUnitId: fields.fromUnitId,
                  toUnitId: fields.toUnitId,
                  factor: fields.factor,
                })
              : await this.conversionFacade.create(fields);
            toast.success(response.message);
            this.close();
          } catch (err: any) {
            toast.error(parseHttpError(err));
          }
        },
      },
    },
  );

  readonly conversionSummary = computed(() => {
    const fromId = this.form.fromUnitId().value();
    const toId = this.form.toUnitId().value();
    const factor = this.form.factor().value();
    if (!fromId || !toId || !factor) return null;

    const fromUnit = this.unitMeasures().find((u) => u.id === fromId);
    const toUnit = this.unitMeasures().find((u) => u.id === toId);

    if (!fromUnit || !toUnit) return null;

    return `1 ${fromUnit.name} = ${factor} ${toUnit.name}`;
  });

  constructor() {
    this.unitMeasureFacade.load();
    this.unitMeasureFacade.updateFilters({ size: 100, active: true });
    if (!this.data && this.canReadProducts()) {
      this.productFacade.load();
      this.productFacade.updateFilters({ size: 100, active: true, sortBy: 'name', sortDir: 'asc' });
    }
  }

  public close() {
    this.dialogRef.close();
  }
}
