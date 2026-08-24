import { Brand } from '../../domain/models/brand.model';
import { BrandApiDto } from '../dtos/brand-api.dto';

export const BrandMapper = {
  fromDto(dto: BrandApiDto | null | undefined): Brand {
    if (!dto) return {} as Brand;
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      logoUrl: dto.logoUrl,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: Brand | null | undefined): BrandApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      logoUrl: model.logoUrl,
      active: model.active,
    };
  },
};
