import { DomainObject } from 'domain-objects';
import Joi from 'joi';

import { DomainObjectVariant } from '../constants';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  extends: Joi.string()
    .valid(...Object.values(DomainObjectVariant))
    .required(),
});

export interface DomainObjectReferenceMetadata {
  name: string;
  extends: DomainObjectVariant;
}
export class DomainObjectReferenceMetadata
  extends DomainObject<DomainObjectReferenceMetadata>
  implements DomainObjectReferenceMetadata
{
  public static schema = schema;
}
