import type { ClassDeclaration } from 'typescript';

import { isOfDomainObjectVariant } from '@src/domain.objects';

import { extractClassExtendsWhat } from './extractClassExtendsWhat';

export const isAClassDecorationWhichExtendsDomainObject = (
  declaration: ClassDeclaration,
) => {
  const extendsWhat = extractClassExtendsWhat(declaration);
  if (!extendsWhat) return false;
  if (isOfDomainObjectVariant(extendsWhat)) return true; // if it extends one of the domain object variants, then its a domain object class declaration
  return false;
};
