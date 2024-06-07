import { DomainLiteral } from 'domain-objects';
import { Literalize } from 'type-fns';

export enum NutrientVariant {
  PROTEIN = 'PROTEIN',
  VITAMIN = 'VITAMIN',
  MINERAL = 'MINERAL',
  CARBOHYDRATE = 'CARBOHYDRATE',
}

export interface Nutrient {
  variant: Literalize<NutrientVariant>;
  value: string;
}
export class Nutrient extends DomainLiteral<Nutrient> implements Nutrient {}
