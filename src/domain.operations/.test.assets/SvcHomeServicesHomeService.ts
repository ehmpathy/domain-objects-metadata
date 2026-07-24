import { DomainEntity } from 'domain-objects';

export interface SvcHomeServicesHomeService {
  uuid?: string;
  slug: string;
  name: string;
}
export class SvcHomeServicesHomeService
  extends DomainEntity<SvcHomeServicesHomeService>
  implements SvcHomeServicesHomeService
{
  public static origin = 'ahbode/svc-home-services' as const;
  public static primary = ['uuid'] as const;
  public static unique = ['slug'] as const;
  public static updatable = [] as const;
}
