import ts from 'typescript';

import { DomainObjectMetadata } from '../domain';
import { getHydratedDomainObjectMetadatasFromFiles } from './hydrate/getHydratedDomainObjectMetadatasFromFiles';

export const introspect = (
  filePaths: string | string[],
): DomainObjectMetadata[] => {
  // normalize the input
  const filePathsToIntrospect = Array.isArray(filePaths)
    ? filePaths
    : [filePaths]; // normalize to array, since its the most general case

  // create a "program" instance: a collection of source files
  const program = ts.createProgram(filePathsToIntrospect, {});

  // filter out all of the `/node_modules/` files, since we dont care to look at those
  const files = program
    .getSourceFiles()
    .filter((file) => !file.fileName.includes('/node_modules/'));

  // now get hydrated domain object metadatas from that file
  return getHydratedDomainObjectMetadatasFromFiles(files);
};
