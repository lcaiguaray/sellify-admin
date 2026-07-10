import { Component, computed, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { form, required, FormRoot, FormField, min, max } from '@angular/forms/signals';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { InventoryFacade } from '../../application/facades/inventory.facade';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { InventoryItem } from '../../domain/models/inventory.model';
import { UnitConversionRepository } from '@modules/catalog/unit-conversion';
import { UnitConversionSearchableDefault, UnitConversion } from '@modules/catalog/unit-conversion';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-inventory-fractionate-dialog',
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
      <h3 hlmDialogTitle>Fraccionar/Desempaquetar</h3>
      <p hlmDialogDescription>
        {{ data.productName }} (Actualmente tienes {{ data.quantity }} {{ data.unitMeasureName }})
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-fractionate-inventory">
        <hlm-field-group>

          <hlm-field>
            <label hlmFieldLabel>Convertir A:</label>
            <select hlmNativeSelect [formField]="form.toUnitId">
              <option value="" disabled>Seleccione unidad destino</option>
              @for (conv of availableConversions(); track conv.id) {
                <option [value]="conv.toUnitId">{{ conv.toUnitName }} (Factor: {{ conv.factor }})</option>
              }
            </select>
            
            @if(availableConversions().length === 0 && !conversionsResource.isLoading()) {
                <span class="text-xs text-destructive mt-1">
                  No hay factores de conversión configurados desde {{ data.unitMeasureName }} para este producto. Configurelos en el Catálogo.
                </span>
            }

            @for (error of form.toUnitId().errors(); track error) {
              <hlm-field-error [validator]="error.kind">
                {{ error.message }}
              </hlm-field-error>
            }
          </hlm-field>

          <hlm-field>
            <label hlmFieldLabel for="quantity">Cantidad a Fraccionar ({{ data.unitMeasureName }})</label>
            <input
              id="quantity"
              hlmInput
              type="number"
              step="1"
              autoComplete="off"
              [formField]="form.quantity"
              placeholder="Ej. 1"
            />
            <span class="text-xs text-muted-foreground mt-1">
              ¿Cuántos {{ data.unitMeasureName }} desea abrir?
            </span>

            @for (error of form.quantity().errors(); track error) {
              <hlm-field-error [validator]="error.kind">
                {{ error.message }}
              </hlm-field-error>
            }
          </hlm-field>
          
          @if(fractionationPreview()) {
            <div class="p-4 bg-muted/50 rounded-lg border border-border mt-2">
              <h4 class="text-sm font-semibold mb-1">💡 Resultado Esperado</h4>
              <p class="text-sm text-muted-foreground">
                Se restarán <strong>{{ form.quantity().value() }} {{ data.unitMeasureName }}</strong> del stock actual.<br/>
                Se sumarán <strong>{{ fractionationPreview() }}</strong> al stock.
              </p>
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
        Cancelar
      </button>
      <button hlmBtn type="submit" form="form-fractionate-inventory" [disabled]="form().submitting() || availableConversions().length === 0">
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Fraccionar
      </button>
    </hlm-dialog-footer>
  `,
})
export class InventoryFractionateDialog {
  private readonly inventoryFacade = inject(InventoryFacade);
  private readonly conversionRepository = inject(UnitConversionRepository);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  private readonly _dialogContext = injectBrnDialogContext<{ inventoryItem: InventoryItem }>();
  protected readonly data = this._dialogContext.inventoryItem;

  readonly conversionsResource = rxResource({
    params: () => this.data.productId,
    stream: ({ params: productId }) => {
      return this.conversionRepository.get({ ...UnitConversionSearchableDefault, productId, size: 100 })
        .pipe(map(res => res.data.content));
    }
  });
  
  readonly availableConversions = computed(() => {
    const all = this.conversionsResource.value() ?? [];
    return all.filter(c => c.fromUnitId === this.data.unitMeasureId);
  });

  protected readonly formModel = signal({
    toUnitId: '',
    quantity: 1,
  });

  public readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.toUnitId, { message: 'Debe seleccionar una unidad' });
      required(schema.quantity, { message: 'El campo es requerido' });
      min(schema.quantity, 1, { message: 'Mínimo 1' });
      max(schema.quantity, this.data.quantity, { message: `No puedes fraccionar más de lo que tienes (${this.data.quantity})` });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const fields = field().value();
            const conversion = this.availableConversions().find(c => c.toUnitId === fields.toUnitId);
            if (!conversion) return;

            const response = await this.inventoryFacade.fractionate({
              inventoryItemId: this.data.id,
              quantity: fields.quantity,
              toUnitId: conversion.toUnitId,
              toUnitName: conversion.toUnitName || '',
              factor: conversion.factor,
            });
            toast.success(response.message);
            this.close();
          } catch (err: any) {
            toast.error(parseHttpError(err));
          }
        },
      },
    },
  );

  readonly fractionationPreview = computed(() => {
     const toUnitId = this.form.toUnitId().value();
     const qty = this.form.quantity().value();
     if(!toUnitId || !qty) return null;
     const conversion = this.availableConversions().find(c => c.toUnitId === toUnitId);
     if(!conversion) return null;
     
     return `${qty * conversion.factor} ${conversion.toUnitName}`;
  });

  public close() {
    this.dialogRef.close();
  }
}
