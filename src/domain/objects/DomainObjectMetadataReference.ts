import { DomainObject } from 'domain-objects';
import { DomainObjectVariant } from '../constants';

export interface DomainObjectMetadataReference {
  name: string;
  extends: DomainObjectVariant;
}
export class DomainObjectMetadataReference extends DomainObject<DomainObjectMetadataReference> implements DomainObjectMetadataReference {}
