import { DomainObject } from 'domain-objects';
import { DomainObjectProperty } from '.';
import { DomainObjectVariant } from '../constants';

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
export class DomainObjectMetadata extends DomainObject<DomainObjectMetadata> implements DomainObjectMetadata {}
