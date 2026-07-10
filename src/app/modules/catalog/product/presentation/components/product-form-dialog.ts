import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { ProductFormModel } from '../../infrastructure/dtos/product-form.dto';
import { form, required, FormRoot, FormField, maxLength, min } from '@angular/forms/signals';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { ProductFacade } from '../../application/facades/product.facade';
import { CategoryFacade } from '@modules/catalog/category';
import { UnitMeasureFacade } from '@modules/catalog/unit-measure';
import { parseHttpError } from '@core/utils/http-error.util';
import { HlmSpinner } from '@ui-spartan/spinner';
import { toast } from '@spartan-ng/brain/sonner';
import { Product } from '../../domain/models/product.model';

@Component({
  selector: 'app-product-form-dialog',
  imports: [
    FormRoot,
    FormField,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmInputGroupImports,
    HlmNativeSelectImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ data ? 'Editar' : 'Crear' }} Producto</h3>
      <p hlmDialogDescription>
        Complete los campos para {{ data ? 'editar el' : 'crear un nuevo' }} producto.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[70vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-create-product">
        <hlm-field-group>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <label hlmFieldLabel for="sku">SKU</label>
              <input id="sku" hlmInput autoComplete="off" [formField]="form.sku" />

              @for (error of form.sku().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel>Categoría</label>
              <select hlmNativeSelect [formField]="form.categoryId">
                <option value="" disabled>Seleccione una categoría</option>
                @for (category of categories(); track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>

              @for (error of form.categoryId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel>Unidad Base</label>
              <select hlmNativeSelect [formField]="form.unitMeasureId">
                <option value="" disabled>Seleccione una unidad</option>
                @for (unit of unitMeasures(); track unit.id) {
                  <option [value]="unit.id">{{ unit.name }} ({{ unit.abbreviation }})</option>
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
              <label hlmFieldLabel for="basePrice">Precio Base</label>
              <input
                id="basePrice"
                hlmInput
                type="number"
                step="0.01"
                autoComplete="off"
                [formField]="form.basePrice"
              />

              @for (error of form.basePrice().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="cost">Costo</label>
              <input
                id="cost"
                hlmInput
                type="number"
                step="0.01"
                autoComplete="off"
                [formField]="form.cost"
              />
            </hlm-field>
            <hlm-field>
              <label hlmFieldLabel for="initialStock">Stock Inicial</label>
              <input
                id="initialStock"
                hlmInput
                type="number"
                autoComplete="off"
                [formField]="form.initialStock"
              />
              @for (error of form.initialStock().errors(); track error) {
                <hlm-field-error [validator]="error.kind">
                  {{ error.message }}
                </hlm-field-error>
              }
            </hlm-field>
          </div>

          <hlm-field>
            <label hlmFieldLabel for="barcode">Código de Barras</label>
            <input id="barcode" hlmInput autoComplete="off" [formField]="form.barcode" />
          </hlm-field>

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
      <button hlmBtn type="submit" form="form-create-product" [disabled]="form().submitting()">
        @if (form().submitting()) {
          <hlm-spinner data-icon="inline-start" />
        }
        Guardar
      </button>
    </hlm-dialog-footer>
  `,
})
export class ProductCreateDialog {
  private readonly productFacade = inject(ProductFacade);
  private readonly categoryFacade = inject(CategoryFacade);
  private readonly unitMeasureFacade = inject(UnitMeasureFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  readonly categories = this.categoryFacade.data;
  readonly unitMeasures = this.unitMeasureFacade.data;

  private readonly _dialogContext = injectBrnDialogContext<{ product: Product }>();
  protected readonly data = this._dialogContext.product;

  protected readonly formModel = signal<ProductFormModel>({
    name: this.data?.name ?? '',
    sku: this.data?.sku ?? '',
    description: this.data?.description ?? '',
    barcode: this.data?.barcode ?? '',
    categoryId: this.data?.categoryId ?? '',
    unitMeasureId: this.data?.unitMeasureId ?? '',
    basePrice: this.data?.basePrice ?? 0,
    cost: this.data?.cost ?? 0,
    initialStock: this.data?.initialStock ?? 0,
    brandId: this.data?.brandId ?? '',
  });

  public readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.name, { message: 'El campo es requerido' });
      required(schema.sku, { message: 'El campo es requerido' });
      required(schema.categoryId, { message: 'El campo es requerido' });
      required(schema.unitMeasureId, { message: 'El campo es requerido' });
      required(schema.basePrice, { message: 'El campo es requerido' });
      min(schema.basePrice, 0, { message: 'Debe ser mayor o igual a 0' });
      required(schema.initialStock, { message: 'El campo es requerido' });
      min(schema.initialStock, 0, { message: 'Debe ser mayor o igual a 0' });
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
              ? await this.productFacade.update({
                  ...this.data,
                  name: fields.name,
                  sku: fields.sku,
                  description: fields.description,
                  barcode: fields.barcode,
                  categoryId: fields.categoryId,
                  unitMeasureId: fields.unitMeasureId,
                  basePrice: fields.basePrice,
                  cost: fields.cost,
                  initialStock: fields.initialStock,
                  brandId: fields.brandId,
                })
              : await this.productFacade.create(fields);
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

  constructor() {
    this.categoryFacade.updateFilters({ size: 100 });
    this.categoryFacade.load();
    this.unitMeasureFacade.updateFilters({ size: 100 });
    this.unitMeasureFacade.load();
  }

  public close() {
    this.dialogRef.close();
  }
}
