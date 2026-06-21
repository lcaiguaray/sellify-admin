import { LookupValueMapper } from '@modules/core/lookup-value';
import { Identity } from '../../domain/models/identity.model';
import { IdentityApiDto } from '../dtos/identity-api.dto';

export const IdentityMapper = {
  fromDto(dto: IdentityApiDto | null | undefined): Identity | null {
    if (!dto) return null;
    return {
      id: dto.id,
      documentType: LookupValueMapper.fromDto(dto.documentType)!,
      gender: LookupValueMapper.fromDto(dto.gender),
      civilStatus: LookupValueMapper.fromDto(dto.civilStatus),
      educationLevel: LookupValueMapper.fromDto(dto.educationLevel),
      isLegalEntity: dto.isLegalEntity,
      taxId: dto.taxId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      businessName: dto.businessName,
      tradeName: dto.tradeName,
      email: dto.email,
      phone: dto.phone,
      inceptionDate: dto.inceptionDate,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: Identity | null | undefined): IdentityApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      documentType: LookupValueMapper.toDto(model.documentType)!,
      gender: LookupValueMapper.toDto(model.gender),
      civilStatus: LookupValueMapper.toDto(model.civilStatus),
      educationLevel: LookupValueMapper.toDto(model.educationLevel),
      isLegalEntity: model.isLegalEntity,
      taxId: model.taxId,
      firstName: model.firstName,
      lastName: model.lastName,
      businessName: model.businessName,
      tradeName: model.tradeName,
      email: model.email,
      phone: model.phone,
      inceptionDate: model.inceptionDate,
      active: model.active,
    };
  },
};
