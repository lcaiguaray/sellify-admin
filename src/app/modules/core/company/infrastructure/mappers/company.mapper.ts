import { Company } from "../../domain/models/company.model";
import { CompanyApiDto } from "../dtos/company-api.dto";

export const CompanyMapper = {
  fromDto(dto: CompanyApiDto | null | undefined): Company | null {
    if (!dto) return null;
    return {
      id: dto.id,
      taxId: dto.taxId,
      businessName: dto.businessName,
      tradeName: dto.tradeName,
      logoUrl: dto.logoUrl,
      websiteUrl: dto.websiteUrl,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: Company | null | undefined): CompanyApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      taxId: model.taxId,
      businessName: model.businessName,
      tradeName: model.tradeName,
      logoUrl: model.logoUrl,
      websiteUrl: model.websiteUrl,
      active: model.active,
    };
  },
};
