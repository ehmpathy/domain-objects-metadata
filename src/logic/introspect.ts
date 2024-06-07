import ts from 'typescript';

import { DomainObjectMetadata } from '../domain';
import { extractRelevantProgramSourceFiles } from './extractRelevantProgramSourceFiles';
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

  // filter out irrelevant source files
  const files = extractRelevantProgramSourceFiles(program.getSourceFiles());

  // now get hydrated domain object metadatas from that file
  return getHydratedDomainObjectMetadatasFromFiles(files);
};
