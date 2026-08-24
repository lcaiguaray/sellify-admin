import {
  CreateProduct,
  Product,
  ProductVariant,
  ProductVariantOption,
} from '../../domain/models/product.model';
import { ProductApiDto, ProductRequestApiDto } from '../dtos/product-api.dto';

function deriveVariantOptions(variants: ProductVariant[]): ProductVariantOption[] {
  const valuesByName = new Map<string, Set<string>>();

  for (const variant of variants) {
    for (const [name, value] of Object.entries(variant.attributes)) {
      if (value === null || value === '') continue;
      const values = valuesByName.get(name) ?? new Set<string>();
      values.add(String(value));
      valuesByName.set(name, values);
    }
  }

  return Array.from(valuesByName, ([name, values]) => ({ name, values: Array.from(values) }));
}

export const ProductMapper = {
  fromDto(dto: ProductApiDto | null | undefined): Product {
    if (!dto) return {} as Product;

    const variants: ProductVariant[] = (dto.variants ?? []).map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      barcode: variant.barcode ?? undefined,
      name: variant.name,
      costPrice: Number(variant.costPrice),
      salePrice: Number(variant.salePrice),
      attributes: variant.attributes ?? {},
      active: variant.active,
    }));
    const firstVariant = variants[0];
    const hasVariant = dto.hasVariant || variants.length > 1;
    const variantOptions = dto.variantOptions?.length
      ? dto.variantOptions.map((option) => ({ ...option, values: [...option.values] }))
      : deriveVariantOptions(variants);

    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      sku: dto.sku ?? firstVariant?.sku ?? '',
      description: dto.description ?? undefined,
      categoryId: dto.category.id,
      categoryName: dto.category.name,
      brandId: dto.brand?.id,
      brandName: dto.brand?.name,
      unitMeasureId: dto.uom.id,
      unitMeasureName: dto.uom.name,
      unitMeasureSymbol: dto.uom.symbol,
      hasVariant,
      variantOptions,
      variants,
      barcode: firstVariant?.barcode,
      basePrice: firstVariant?.salePrice ?? 0,
      cost: firstVariant?.costPrice,
      initialStock: 0,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toRequest(model: CreateProduct | Product): ProductRequestApiDto {
    return {
      categoryId: model.categoryId,
      brandId: model.brandId || null,
      uomId: model.unitMeasureId,
      name: model.name.trim(),
      slug: model.slug.trim(),
      description: model.description?.trim() || null,
      hasVariant: model.hasVariant,
      variantOptions: model.hasVariant
        ? model.variantOptions.map((option) => ({
            name: option.name.trim(),
            values: option.values.map((value) => value.trim()).filter(Boolean),
          }))
        : [],
      variants: model.variants.map((variant) => ({
        id: variant.id ?? null,
        sku: variant.sku.trim(),
        name: variant.name.trim(),
        barcode: variant.barcode?.trim() || null,
        salePrice: Number(variant.salePrice),
        costPrice: Number(variant.costPrice),
        attributes: model.hasVariant ? variant.attributes : {},
      })),
    };
  },
};
