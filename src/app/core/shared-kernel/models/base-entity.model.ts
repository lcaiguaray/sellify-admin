export interface IdentityKey {
  id: string;
}

export interface Auditable {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Stateable {
  active: boolean;
}

export interface BaseEntity extends IdentityKey, Auditable, Stateable {}
export interface SimpleEntity extends IdentityKey, Stateable {}
