import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { DomainObjectMetadataReference } from './DomainObjectMetadataReference';

export enum DomainObjectPropertyType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  REFERENCE = 'REFERENCE',
  ENUM = 'ENUM',
}

const schema = Joi.object().keys({
  type: Joi.string()
    .valid(...Object.values(DomainObjectPropertyType))
    .required(),
  of: Joi.any().optional(),
  required: Joi.boolean().optional(),
  nullable: Joi.boolean().optional(),
});

export interface DomainObjectProperty {
  type: DomainObjectPropertyType;
  of?:
    | DomainObjectMetadataReference // if referencing another domain object
    | DomainObjectProperty // if its an array, this holds the type of objects in the array
    | string[] // if its an enum, this holds the options of the enum
    | string; // before being hydrated, this holds the name of the referenced type for references
  required?: boolean;
  nullable?: boolean;
}
export class DomainObjectProperty extends DomainObject<DomainObjectProperty> implements DomainObjectProperty {
  public static schema = schema;
}
