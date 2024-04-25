import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { DomainObjectReferenceMetadata } from './DomainObjectReferenceMetadata';

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

const schema = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(DomainObjectPropertyType))
    .required(),
  of: Joi.any().optional(),
  required: Joi.boolean().optional(),
  nullable: Joi.boolean().optional(),
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
