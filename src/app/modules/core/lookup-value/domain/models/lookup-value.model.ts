import { SimpleEntity } from "@core/shared-kernel/models/base-entity.model";

export interface LookupValue extends SimpleEntity {
  lookupGroupId: string;
  code: string;
  name: string;
  description: string | null;
}
