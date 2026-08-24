import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormField, form, FormRoot, maxLength, min, required } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeDelete04, hugePlusSign } from '@ng-icons/huge-icons';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { parseHttpError } from '@core/utils/http-error.util';
import { BrandFacade } from '@modules/catalog/brand';
import { CategoryFacade } from '@modules/catalog/category';
import { UnitMeasureFacade } from '@modules/catalog/unit-measure';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmCheckboxImports } from '@ui-spartan/checkbox';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { HlmFieldImports } from '@ui-spartan/field';
import { HlmInputImports } from '@ui-spartan/input';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { HlmNativeSelectImports } from '@ui-spartan/native-select';
import { HlmSpinner } from '@ui-spartan/spinner';
import { ProductFacade } from '../../application/facades/product.facade';
import {
  CreateProduct,
  Product,
  ProductVariant,
  ProductVariantAttribute,
  ProductVariantOption,
} from '../../domain/models/product.model';
import { ProductFormModel } from '../../infrastructure/dtos/product-form.dto';

@Component({
  selector: 'app-product-form-dialog',
  imports: [
    FormRoot,
    FormField,
    NgIcon,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmInputGroupImports,
    HlmNativeSelectImports,
    HlmSpinner,
  ],
  providers: [provideIcons({ hugePlusSign, hugeDelete04 })],
  host: { class: 'flex flex-col gap-4' },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ data ? 'Editar' : 'Crear' }} Producto</h3>
      <p hlmDialogDescription>
        Registre los datos comerciales y las variantes disponibles del producto.
      </p>
    </hlm-dialog-header>

    <div class="no-scrollbar -mx-4 max-h-[72vh] overflow-y-auto px-4">
      <form [formRoot]="form" id="form-product">
        <hlm-field-group>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <hlm-field>
              <label hlmFieldLabel for="name">Nombre</label>
              <input id="name" hlmInput autoComplete="off" [formField]="form.name" />
              @for (error of form.name().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel for="slug">Slug</label>
              <input
                id="slug"
                hlmInput
                autoComplete="off"
                [formField]="form.slug"
                (input)="onSlugInput()"
              />
              @for (error of form.slug().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <hlm-field>
              <label hlmFieldLabel>Categoría</label>
              <select hlmNativeSelect [formField]="form.categoryId">
                <option value="" disabled>Seleccione una categoría</option>
                @for (category of categories(); track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
              @for (error of form.categoryId().errors(); track error) {
                <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
              }
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel>Marca (opcional)</label>
              <select hlmNativeSelect [formField]="form.brandId">
                <option value="">Sin marca</option>
                @for (brand of brands(); track brand.id) {
                  <option [value]="brand.id">{{ brand.name }}</option>
                }
              </select>
            </hlm-field>

            <hlm-field>
              <label hlmFieldLabel>Unidad base</label>
              <select hlmNativeSelect [formField]="form.unitMeasureId">
                <option value="" disabled>Seleccione una unidad</option>
                @for (unit of unitMeasures(); track unit.id) {
                  <option [value]="unit.id">{{ unit.name }} ({{ unit.symbol }})</option>
                }
              </select>
              @for (error of form.unitMeasureId().errors(); track error) {
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
                class="min-h-20"
                rows="3"
                [formField]="form.description"
              ></textarea>
              <hlm-input-group-addon align="block-end">
                <span hlmInputGroupText>{{ descriptionLength() }}/150 caracteres</span>
              </hlm-input-group-addon>
            </hlm-input-group>
            @for (error of form.description().errors(); track error) {
              <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
            }
          </hlm-field>

          <div class="rounded-lg border border-border bg-muted/20 p-4">
            <label class="flex cursor-pointer items-center gap-3">
              <hlm-checkbox
                [formField]="form.hasVariant"
                (checkedChange)="onVariantModeChange($event)"
              />
              <span>
                <span class="block text-sm font-medium">Este producto tiene variantes</span>
                <span class="block text-xs text-muted-foreground">
                  Use variantes para combinaciones como color, talla o almacenamiento.
                </span>
              </span>
            </label>
          </div>

          @if (!form.hasVariant().value()) {
            <div class="rounded-lg border border-border p-4">
              <h4 class="mb-3 text-sm font-semibold">Presentación única</h4>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <hlm-field>
                  <label hlmFieldLabel for="sku">SKU</label>
                  <input id="sku" hlmInput autoComplete="off" [formField]="form.sku" />
                  @for (error of form.sku().errors(); track error) {
                    <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
                  }
                </hlm-field>
                <hlm-field>
                  <label hlmFieldLabel for="barcode">Código de barras</label>
                  <input id="barcode" hlmInput autoComplete="off" [formField]="form.barcode" />
                </hlm-field>
                <hlm-field>
                  <label hlmFieldLabel for="salePrice">Precio de venta</label>
                  <input
                    id="salePrice"
                    hlmInput
                    type="number"
                    step="0.01"
                    [formField]="form.salePrice"
                  />
                  @for (error of form.salePrice().errors(); track error) {
                    <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
                  }
                </hlm-field>
                <hlm-field>
                  <label hlmFieldLabel for="costPrice">Precio de costo</label>
                  <input
                    id="costPrice"
                    hlmInput
                    type="number"
                    step="0.01"
                    [formField]="form.costPrice"
                  />
                  @for (error of form.costPrice().errors(); track error) {
                    <hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
                  }
                </hlm-field>
              </div>
            </div>
          } @else {
            <div class="space-y-4 rounded-lg border border-border p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h4 class="text-sm font-semibold">Opciones de variantes</h4>
                  <p class="text-xs text-muted-foreground">
                    Escriba los valores separados por comas; las combinaciones se generan
                    automáticamente.
                  </p>
                </div>
                <button
                  hlmBtn
                  type="button"
                  size="sm"
                  variant="outline"
                  (click)="addVariantOption()"
                >
                  <ng-icon name="hugePlusSign" /> Opción
                </button>
              </div>

              @for (option of variantOptions(); track $index; let optionIndex = $index) {
                <div class="grid grid-cols-[1fr_2fr_auto] items-end gap-2">
                  <hlm-field>
                    <label hlmFieldLabel [for]="'option-name-' + optionIndex">Nombre</label>
                    <input
                      hlmInput
                      [id]="'option-name-' + optionIndex"
                      [value]="option.name"
                      placeholder="Ej. color"
                      (input)="updateVariantOption(optionIndex, 'name', $any($event.target).value)"
                    />
                  </hlm-field>
                  <hlm-field>
                    <label hlmFieldLabel [for]="'option-values-' + optionIndex">Valores</label>
                    <input
                      hlmInput
                      [id]="'option-values-' + optionIndex"
                      [value]="option.values.join(', ')"
                      placeholder="Ej. Negro, Azul, Rojo"
                      (change)="
                        updateVariantOption(optionIndex, 'values', $any($event.target).value)
                      "
                    />
                  </hlm-field>
                  <button
                    hlmBtn
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Eliminar opción"
                    (click)="removeVariantOption(optionIndex)"
                  >
                    <ng-icon name="hugeDelete04" />
                  </button>
                </div>
              }

              @if (variantOptions().length === 0) {
                <p class="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Agregue al menos una opción para generar las variantes.
                </p>
              }
            </div>

            @if (variants().length > 0) {
              <div class="space-y-3 rounded-lg border border-border p-4">
                <div>
                  <h4 class="text-sm font-semibold">Variantes ({{ variants().length }})</h4>
                  <p class="text-xs text-muted-foreground">
                    Complete SKU, nombre y precios para cada combinación.
                  </p>
                </div>
                <div class="overflow-x-auto">
                  <div class="min-w-[760px] space-y-2">
                    @for (
                      variant of variants();
                      track variantKey(variant, $index);
                      let variantIndex = $index
                    ) {
                      <div
                        class="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr] gap-2 rounded-md bg-muted/30 p-2"
                      >
                        <hlm-field>
                          <label hlmFieldLabel [for]="'variant-sku-' + variantIndex">SKU</label>
                          <input
                            hlmInput
                            [id]="'variant-sku-' + variantIndex"
                            [value]="variant.sku"
                            (input)="updateVariant(variantIndex, 'sku', $any($event.target).value)"
                          />
                        </hlm-field>
                        <hlm-field>
                          <label hlmFieldLabel [for]="'variant-name-' + variantIndex">Nombre</label>
                          <input
                            hlmInput
                            [id]="'variant-name-' + variantIndex"
                            [value]="variant.name"
                            (input)="updateVariant(variantIndex, 'name', $any($event.target).value)"
                          />
                        </hlm-field>
                        <hlm-field>
                          <label hlmFieldLabel [for]="'variant-barcode-' + variantIndex"
                            >Código barras</label
                          >
                          <input
                            hlmInput
                            [id]="'variant-barcode-' + variantIndex"
                            [value]="variant.barcode ?? ''"
                            (input)="
                              updateVariant(variantIndex, 'barcode', $any($event.target).value)
                            "
                          />
                        </hlm-field>
                        <hlm-field>
                          <label hlmFieldLabel [for]="'variant-sale-' + variantIndex">Venta</label>
                          <input
                            hlmInput
                            type="number"
                            min="0"
                            step="0.01"
                            [id]="'variant-sale-' + variantIndex"
                            [value]="variant.salePrice"
                            (input)="
                              updateVariant(variantIndex, 'salePrice', $any($event.target).value)
                            "
                          />
                        </hlm-field>
                        <hlm-field>
                          <label hlmFieldLabel [for]="'variant-cost-' + variantIndex">Costo</label>
                          <input
                            hlmInput
                            type="number"
                            min="0"
                            step="0.01"
                            [id]="'variant-cost-' + variantIndex"
                            [value]="variant.costPrice"
                            (input)="
                              updateVariant(variantIndex, 'costPrice', $any($event.target).value)
                            "
                          />
                        </hlm-field>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
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
      <button hlmBtn type="submit" form="form-product" [disabled]="form().submitting()">
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
  private readonly brandFacade = inject(BrandFacade);
  private readonly unitMeasureFacade = inject(UnitMeasureFacade);
  private readonly dialogRef = inject<BrnDialogRef<null>>(BrnDialogRef);

  private readonly dialogContext = injectBrnDialogContext<{ product: Product | null }>();
  protected readonly data = this.dialogContext.product;
  private readonly firstVariant = this.data?.variants[0];

  readonly categories = this.categoryFacade.data;
  readonly brands = this.brandFacade.data;
  readonly unitMeasures = this.unitMeasureFacade.data;

  protected readonly formModel = signal<ProductFormModel>({
    name: this.data?.name ?? '',
    slug: this.data?.slug ?? '',
    description: this.data?.description ?? '',
    categoryId: this.data?.categoryId ?? '',
    unitMeasureId: this.data?.unitMeasureId ?? '',
    brandId: this.data?.brandId ?? '',
    hasVariant: this.data?.hasVariant ?? false,
    sku: this.firstVariant?.sku ?? '',
    barcode: this.firstVariant?.barcode ?? '',
    salePrice: this.firstVariant?.salePrice ?? 0,
    costPrice: this.firstVariant?.costPrice ?? 0,
  });

  readonly variantOptions = signal<ProductVariantOption[]>(
    (this.data?.variantOptions ?? []).map((option) => ({
      name: option.name,
      values: [...option.values],
    })),
  );
  readonly variants = signal<ProductVariant[]>(
    (this.data?.variants ?? []).map((variant) => ({
      ...variant,
      attributes: { ...variant.attributes },
    })),
  );
  private readonly slugTouched = signal(false);

  readonly form = form(
    this.formModel,
    (schema) => {
      required(schema.name, { message: 'El campo es requerido' });
      required(schema.slug, { message: 'El campo es requerido' });
      required(schema.categoryId, { message: 'El campo es requerido' });
      required(schema.unitMeasureId, { message: 'El campo es requerido' });
      required(schema.salePrice, { message: 'El campo es requerido' });
      min(schema.salePrice, 0, { message: 'Debe ser mayor o igual a 0' });
      required(schema.costPrice, { message: 'El campo es requerido' });
      min(schema.costPrice, 0, { message: 'Debe ser mayor o igual a 0' });
      maxLength(schema.description, 150, {
        message: 'La descripción no puede exceder 150 caracteres',
      });
    },
    {
      submission: {
        action: async (field) => {
          const fields = field().value();
          if (!/^[a-z0-9-]+$/.test(fields.slug)) {
            toast.error('El slug solo puede contener minúsculas, números y guiones.');
            return;
          }

          const payload = this.buildPayload(fields);
          if (!payload) return;

          try {
            const response = this.data
              ? await this.productFacade.update({ ...this.data, ...payload })
              : await this.productFacade.create(payload);
            toast.success(response.message);
            this.close();
          } catch (err: any) {
            toast.error(parseHttpError(err));
          }
        },
      },
    },
  );

  readonly descriptionLength = computed(() => this.form.description().value().length);

  constructor() {
    this.categoryFacade.load();
    this.categoryFacade.updateFilters({ size: 100, active: true, sortBy: 'name', sortDir: 'asc' });
    this.brandFacade.load();
    this.brandFacade.updateFilters({ size: 100, active: true, sortBy: 'name', sortDir: 'asc' });
    this.unitMeasureFacade.load();
    this.unitMeasureFacade.updateFilters({
      size: 100,
      active: true,
      sortBy: 'name',
      sortDir: 'asc',
    });

    effect(() => {
      const name = this.form.name().value();
      if (this.slugTouched() || this.data) return;
      untracked(() => this.form.slug().value.set(this.slugify(name)));
    });

    if (
      this.form.hasVariant().value() &&
      this.variantOptions().length > 0 &&
      this.variants().length === 0
    ) {
      this.regenerateVariants();
    }
  }

  protected onSlugInput(): void {
    this.slugTouched.set(true);
  }

  protected onVariantModeChange(hasVariant: boolean): void {
    if (hasVariant && this.variantOptions().length === 0) {
      this.variantOptions.set([{ name: '', values: [] }]);
    }
  }

  protected addVariantOption(): void {
    this.variantOptions.update((options) => [...options, { name: '', values: [] }]);
  }

  protected removeVariantOption(index: number): void {
    this.variantOptions.update((options) =>
      options.filter((_, optionIndex) => optionIndex !== index),
    );
    this.regenerateVariants();
  }

  protected updateVariantOption(index: number, field: 'name' | 'values', rawValue: string): void {
    this.variantOptions.update((options) =>
      options.map((option, optionIndex) => {
        if (optionIndex !== index) return option;
        return field === 'name'
          ? { ...option, name: rawValue }
          : {
              ...option,
              values: Array.from(
                new Set(
                  rawValue
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean),
                ),
              ),
            };
      }),
    );
    this.regenerateVariants();
  }

  protected updateVariant(
    index: number,
    field: 'sku' | 'name' | 'barcode' | 'salePrice' | 'costPrice',
    rawValue: string,
  ): void {
    this.variants.update((variants) =>
      variants.map((variant, variantIndex) => {
        if (variantIndex !== index) return variant;
        const value = field === 'salePrice' || field === 'costPrice' ? Number(rawValue) : rawValue;
        return { ...variant, [field]: value };
      }),
    );
  }

  protected variantKey(variant: ProductVariant, index: number): string {
    return variant.id ?? `${this.attributesKey(variant.attributes)}-${index}`;
  }

  private regenerateVariants(): void {
    const options = this.variantOptions();
    if (options.length === 0) {
      this.variants.set([]);
      return;
    }
    if (options.some((option) => !option.name.trim() || option.values.length === 0)) return;

    let combinations: Array<Record<string, ProductVariantAttribute>> = [{}];
    for (const option of options) {
      combinations = combinations.flatMap((attributes) =>
        option.values.map((value) => ({ ...attributes, [option.name.trim()]: value })),
      );
    }

    const previous = this.variants();
    this.variants.set(
      combinations.map((attributes) => {
        const existing = previous.find(
          (variant) => this.attributesKey(variant.attributes) === this.attributesKey(attributes),
        );
        const suffix = Object.values(attributes).join(' / ');
        return existing
          ? { ...existing, attributes }
          : {
              sku: '',
              barcode: '',
              name: `${this.form.name().value().trim()}${suffix ? ` - ${suffix}` : ''}`,
              costPrice: 0,
              salePrice: 0,
              attributes,
              active: true,
            };
      }),
    );
  }

  private buildPayload(fields: ProductFormModel): CreateProduct | null {
    const hasVariant = fields.hasVariant;
    let variants: ProductVariant[];
    let variantOptions: ProductVariantOption[];

    if (hasVariant) {
      variantOptions = this.variantOptions().map((option) => ({
        name: option.name.trim(),
        values: option.values.map((value) => value.trim()).filter(Boolean),
      }));
      if (
        variantOptions.length === 0 ||
        variantOptions.some((option) => !option.name || option.values.length === 0)
      ) {
        toast.error('Complete al menos una opción y sus valores.');
        return null;
      }

      variants = this.variants();
      if (
        variants.length === 0 ||
        variants.some(
          (variant) =>
            !variant.sku.trim() ||
            !variant.name.trim() ||
            !Number.isFinite(variant.salePrice) ||
            variant.salePrice < 0 ||
            !Number.isFinite(variant.costPrice) ||
            variant.costPrice < 0,
        )
      ) {
        toast.error('Complete el SKU, nombre y precios válidos de todas las variantes.');
        return null;
      }
    } else {
      if (!fields.sku.trim()) {
        toast.error('El SKU es obligatorio para un producto sin variantes.');
        return null;
      }
      variantOptions = [];
      variants = [
        {
          id: this.data?.hasVariant ? undefined : this.firstVariant?.id,
          sku: fields.sku,
          barcode: fields.barcode || undefined,
          name: fields.name,
          salePrice: Number(fields.salePrice),
          costPrice: Number(fields.costPrice),
          attributes: {},
          active: this.firstVariant?.active ?? true,
        },
      ];
    }

    return {
      categoryId: fields.categoryId,
      brandId: fields.brandId || null,
      unitMeasureId: fields.unitMeasureId,
      name: fields.name,
      slug: fields.slug,
      description: fields.description,
      hasVariant,
      variantOptions,
      variants,
    };
  }

  private attributesKey(attributes: Record<string, ProductVariantAttribute>): string {
    return JSON.stringify(
      Object.entries(attributes)
        .map(([key, value]) => [key.trim(), String(value)] as const)
        .sort(([left], [right]) => left.localeCompare(right)),
    );
  }

  private slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  close(): void {
    this.dialogRef.close();
  }
}
