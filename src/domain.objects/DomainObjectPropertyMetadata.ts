import { DomainObject } from 'domain-objects';
import { z } from 'zod';

import type { DomainObjectReferenceMetadata } from './DomainObjectReferenceMetadata';

export enum DomainObjectPropertyType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ARRAY = 'ARRAY',
  REFERENCE = 'REFERENCE',
  ENUM = 'ENUM',
  ALIAS = 'ALIAS',
}

const schema = z.object({
  name: z.string().optional(), // may be omitted, if used in "of" // todo: create a separate type for this
  type: z.nativeEnum(DomainObjectPropertyType),
  of: z.any().optional(),
  required: z.boolean().optional(),
  nullable: z.boolean().optional(),
});

export interface DomainObjectPropertyMetadata {
  name: string;
  type: DomainObjectPropertyType;
  of?:
    | DomainObjectReferenceMetadata // if referencing another domain object
    | Omit<DomainObjectPropertyMetadata, 'name'> // if its an array, this holds the type of objects in the array
    | string[] // if its an enum, this holds the options of the enum
    | string; // before being hydrated, this holds the name of the referenced type for references
  required?: boolean;
  nullable?: boolean;
}
export class DomainObjectPropertyMetadata
  extends DomainObject<DomainObjectPropertyMetadata>
  implements DomainObjectPropertyMetadata
{
  public static schema = schema;
}
