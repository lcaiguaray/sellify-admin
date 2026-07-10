export interface ContactApiDto {
  id: string;
  documentType: 'DNI' | 'RUC' | 'CE' | 'PASAPORTE' | 'OTROS';
  documentNumber: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isCustomer: boolean;
  isProvider: boolean;
  isEmployee: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
