import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { DomainObjectVariant } from '../constants';
import { DomainObjectPropertyMetadata } from './DomainObjectPropertyMetadata';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  extends: Joi.string()
    .valid(...Object.values(DomainObjectVariant))
    .required(),
  properties: Joi.object().pattern(
    Joi.string(),
    DomainObjectPropertyMetadata.schema,
  ),
  decorations: Joi.object().keys({
    unique: Joi.array().items(Joi.string()).allow(null).required(),
    updatable: Joi.array().items(Joi.string()).allow(null).required(),
  }),
});

export interface DomainObjectMetadata {
  name: string;
  extends: DomainObjectVariant;
  properties: {
    [index: string]: DomainObjectPropertyMetadata;
  };
  decorations: {
    unique: string[] | null;
    updatable: string[] | null;
  };
}
export class DomainObjectMetadata
  extends DomainObject<DomainObjectMetadata>
  implements DomainObjectMetadata
{
  public static schema = schema;
}
