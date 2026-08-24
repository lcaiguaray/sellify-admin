import { Component, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';
import { InventoryFormModel } from '../../infrastructure/dtos/inventory-form.dto';
import { form, required, min, FormRoot, FormField } from '@angular/forms/signals';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { InventoryFacade } from '../../application/facades/inventory.facade';
import { ProductFacade } from '@modules/catalog/product';
import { UnitMeasureFacade } from '@modules/catalog/unit-measure';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { InventoryItem } from '../../domain/models/inventory.model';

@Component({
  selector: 'app-inventory-form-dialog',
  imports: [
    FormRoot,
    FormField,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmNativeSelectImports,
    HlmButtonImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ data ? 'Editar' : 'Crear' }} Registro de Inventario</h3>
      <p hlmDialogDescription>
        Complete los campos para {{ data ? 'editar el' : 'crear un nuevo' }} registro de inventario.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create-inventory">
        <hlm-field-group>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel>Producto</label>
              <select hlmNativeSelect [formField]="form.productId">
                <option value="" disabled>Seleccione un producto</option>
                @for (product of products(); track product.id) {
                  <option [value]="product.id">{{ product.name }}</option>
                }
              </select>

              @for (error of form.productId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel>Unidad de Medida</label>
              <select hlmNativeSelect [formField]="form.unitMeasureId">
                <option value="" disabled>Seleccione una unidad</option>
                @for (unit of unitMeasures(); track unit.id) {
                  <option [value]="unit.id">{{ unit.name }}</option>
                }
              </select>

              @for (error of form.unitMeasureId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <hlm-field>
              <label hlmFieldLabel for="quantity">Cantidad</label>
              <input
                id="quantity"
                hlmInput
                type="number"
                autoComplete="off"
                [formField]="form.quantity"
              />

              @for (error of form.quantity().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="minStock">Stock Mínimo</label>
              <input
                id="minStock"
                hlmInput
                type="number"
                autoComplete="off"
                [formField]="form.minStock"
              />
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="maxStock">Stock Máximo</label>
              <input
                id="maxStock"
                hlmInput
                type="number"
                autoComplete="off"
                [formField]="form.maxStock"
              />
            </hlm-field>
          </div>
          <hlm-field>
            <label hlmFieldLabel for="warehouseId">ID del Almacén</label>
            <input id="warehouseId" hlmInput autoComplete="off" [formField]="form.warehouseId" />
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
      <button hlmBtn type="submit" form="form-create-inventory" [disabled]="form().submitting()">
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class InventoryCreateDialog {
  private readonly inventoryFacade = inject(InventoryFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);
  private readonly productFacade = inject(ProductFacade);
  private readonly unitMeasureFacade = inject(UnitMeasureFacade);

  readonly products = this.productFacade.data;
  readonly unitMeasures = this.unitMeasureFacade.data;

  private readonly _dialogContext = injectBrnDialogContext<{ inventoryItem: InventoryItem }>();
  protected readonly data = this._dialogContext.inventoryItem;

  constructor() {
    this.productFacade.updateFilters({ size: 1000 });
    this.productFacade.load();
    this.unitMeasureFacade.updateFilters({ size: 1000 });
    this.unitMeasureFacade.load();
  }

  protected readonly formModel = signal<InventoryFormModel>({
    productId: this.data?.productId ?? '',
    unitMeasureId: this.data?.unitMeasureId ?? '',
    quantity: this.data?.quantity ?? 0,
    minStock: this.data?.minStock ?? 0,
    maxStock: this.data?.maxStock ?? 0,
    warehouseId: this.data?.warehouseId ?? '',
  });

  public readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.productId, { message: 'El campo es requerido' });
      required(schema.unitMeasureId, { message: 'El campo es requerido' });
      required(schema.quantity, { message: 'El campo es requerido' });
      min(schema.quantity, 1, { message: 'Debe ser mayor a 0' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            const fields = field().value();
            const response = this.data
              ? await this.inventoryFacade.update({
                  ...this.data,
                  productId: fields.productId,
                  unitMeasureId: fields.unitMeasureId,
                  quantity: fields.quantity,
                  minStock: fields.minStock,
                  maxStock: fields.maxStock,
                  warehouseId: fields.warehouseId,
                })
              : await this.inventoryFacade.create(fields);
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
