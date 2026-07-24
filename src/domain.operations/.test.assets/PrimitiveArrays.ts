import { DomainEntity } from 'domain-objects';

export interface PrimitiveArrays {
  id: string;
  tags: string[]; // required primitive string array
  scores: number[]; // required primitive number array
  flags: boolean[]; // required primitive boolean array
  occurredAts: Date[]; // required primitive date array
  labels: string[] | null; // nullable primitive string array
  ratings?: number[]; // optional primitive number array
}
export class PrimitiveArrays
  extends DomainEntity<PrimitiveArrays>
  implements PrimitiveArrays
{
  public static unique = ['id'];
}
