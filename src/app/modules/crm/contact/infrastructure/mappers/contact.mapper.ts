import { Contact } from '../../domain/models/contact.model';
import { ContactApiDto } from '../dtos/contact-api.dto';

export const ContactMapper = {
  fromDto(dto: ContactApiDto | null | undefined): Contact {
    if (!dto) return {} as Contact;
    return {
      id: dto.id,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      isCustomer: dto.isCustomer,
      isProvider: dto.isProvider,
      isEmployee: dto.isEmployee,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
  },

  toDto(model: Contact | null | undefined): ContactApiDto | null {
    if (!model) return null;
    return {
      id: model.id,
      documentType: model.documentType,
      documentNumber: model.documentNumber,
      name: model.name,
      email: model.email,
      phone: model.phone,
      address: model.address,
      isCustomer: model.isCustomer,
      isProvider: model.isProvider,
      isEmployee: model.isEmployee,
      active: model.active,
    };
  },
};
