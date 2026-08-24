import { Category } from '../../domain/models/category.model';
import { CategoryApiDto } from '../dtos/category-api.dto';

export const CategoryMapper = {
  fromDto(dto: CategoryApiDto | null | undefined): Category {
    if (!dto) return {} as Category;
    return {
      id: dto.id,
      parentId: dto.parentId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: Category | null | undefined): CategoryApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      parentId: model.parentId,
      name: model.name,
      slug: model.slug,
      description: model.description,
      active: model.active,
    };
  },
};
