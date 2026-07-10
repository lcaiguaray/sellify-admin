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
import { ProductFacade } from '@modules/catalog/product';
import { UnitMeasureFacade } from '@modules/catalog/unit-measure';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { UnitConversion, UnitConversionSearchableDefault } from '../../domain/models/unit-conversion.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { UnitConversionRepository } from '../../domain/repositories/unit-conversion.repository';
import { map, of } from 'rxjs';

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
      <p hlmDialogDescription>
        Especifique el factor de conversión entre dos unidades para un producto.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create-unit-conversion">
        <hlm-field-group>
          <hlm-field>
            <label hlmFieldLabel>Producto</label>
            <select hlmNativeSelect [formField]="form.productId">
              <option value="" disabled>Seleccione un producto</option>
              @for (product of products(); track product.id) {
                <option [value]="product.id">{{ product.name }} ({{ product.sku }})</option>
              }
            </select>

            @for (error of form.productId().errors(); track error) {
              <hlm-field-error [validator]="error.kind">
                {{ error.message }}
              </hlm-field-error>
            }
          </hlm-field>

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
              <h4 class="text-sm font-semibold mb-1">💡 Pre-visualización</h4>
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
      <button hlmBtn type="submit" form="form-create-unit-conversion" [disabled]="form().submitting()">
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
  private readonly conversionRepository = inject(UnitConversionRepository);
  private readonly productFacade = inject(ProductFacade);
  private readonly unitMeasureFacade = inject(UnitMeasureFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  readonly products = this.productFacade.data;
  readonly unitMeasures = this.unitMeasureFacade.data;

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
      required(schema.productId, { message: 'El campo es requerido' });
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

  readonly productConversionsResource = rxResource({
    params: () => this.form.productId().value(),
    stream: ({ params: productId }) => {
      if (!productId) return of([]);
      return this.conversionRepository.get({ ...UnitConversionSearchableDefault, productId, size: 100 })
        .pipe(map(res => res.data.content));
    }
  });

  readonly conversionSummary = computed(() => {
    const fromId = this.form.fromUnitId().value();
    const toId = this.form.toUnitId().value();
    const factor = this.form.factor().value();
    const existing = this.productConversionsResource.value() ?? [];
    
    if (!fromId || !toId || !factor) return null;

    const fromUnit = this.unitMeasures().find(u => u.id === fromId);
    const toUnit = this.unitMeasures().find(u => u.id === toId);

    if (!fromUnit || !toUnit) return null;

    let summary = `1 ${fromUnit.name} = ${factor} ${toUnit.name}`;

    // Buscar si la unidad destino tiene una conversión adicional (ej: Caja -> Paquete)
    const nextConversion = existing.find(c => c.fromUnitId === toId);
    if (nextConversion) {
      const nextFactor = nextConversion.factor;
      const totalFactor = factor * nextFactor;
      summary += ` = ${totalFactor} ${nextConversion.toUnitName}`;
      
      // Buscar un tercer nivel (ej: Paquete -> Unidad)
      const level3Conversion = existing.find(c => c.fromUnitId === nextConversion.toUnitId);
      if (level3Conversion) {
        const totalLevel3 = totalFactor * level3Conversion.factor;
        summary += ` = ${totalLevel3} ${level3Conversion.toUnitName}`;
      }
    }

    return summary;
  });

  constructor() {
    this.productFacade.updateFilters({ size: 1000 });
    this.productFacade.load();
    this.unitMeasureFacade.updateFilters({ size: 100 });
    this.unitMeasureFacade.load();
  }

  public close() {
    this.dialogRef.close();
  }
}
