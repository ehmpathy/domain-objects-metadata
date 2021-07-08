import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { DomainObjectProperty } from './DomainObjectProperty';
import { DomainObjectVariant } from '../constants';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  extends: Joi.string()
    .valid(...Object.values(DomainObjectVariant))
    .required(),
  properties: Joi.object().pattern(Joi.string(), DomainObjectProperty.schema),
  decorations: Joi.object().keys({
    unique: Joi.array().items(Joi.string()).allow(null).required(),
    updatable: Joi.array().items(Joi.string()).allow(null).required(),
  }),
});

export interface DomainObjectMetadata {
  name: string;
  extends: DomainObjectVariant;
  properties: {
    [index: string]: DomainObjectProperty;
  };
  decorations: {
    unique: string[] | null;
    updatable: string[] | null;
  };
}
export class DomainObjectMetadata extends DomainObject<DomainObjectMetadata> implements DomainObjectMetadata {
  public static schema = schema;
}
