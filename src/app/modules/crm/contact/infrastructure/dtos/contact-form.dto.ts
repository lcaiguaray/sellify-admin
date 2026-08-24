import { DocumentType } from '../../domain/models/contact.model';

export interface ContactFormModel {
  documentType: DocumentType;
  documentNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isCustomer: boolean;
  isProvider: boolean;
  isEmployee: boolean;
}
