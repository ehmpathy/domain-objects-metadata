import { DomainObject } from 'domain-objects';
import Joi from 'joi';
import { DomainObjectVariant } from '../constants';

const schema = Joi.object().keys({
  name: Joi.string().required(),
  extends: Joi.string()
    .valid(...Object.values(DomainObjectVariant))
    .required(),
});

export interface DomainObjectMetadataReference {
  name: string;
  extends: DomainObjectVariant;
}
export class DomainObjectMetadataReference extends DomainObject<DomainObjectMetadataReference> implements DomainObjectMetadataReference {
  public static schema = schema;
}
