import ts, { isClassDeclaration } from 'typescript';

import { extractDomainObjectMetadataForDeclarationInFile } from './extractDomainObjectMetadataForDeclarationInFile';

describe('extractDomainObjectMetadataForDeclarationInFile', () => {
  it('should be able to extract domain object metadata for simple value object', () => {
    const program = ts.createProgram(
      [`${__dirname}/../__test_assets__/Address.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Address.ts'))!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const metadata = extractDomainObjectMetadataForDeclarationInFile({
      file,
      classDeclaration,
    });
    // console.log(JSON.stringify(metadata, null, 2));

    // log an example
    expect(metadata).toMatchSnapshot();
  });
  it('should be able to extract domain object metadata for a simple entity', () => {
    const program = ts.createProgram(
      [`${__dirname}/../__test_assets__/LoadingDock.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/LoadingDock.ts'))!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const metadata = extractDomainObjectMetadataForDeclarationInFile({
      file,
      classDeclaration,
    });
    // console.log(JSON.stringify(metadata, null, 2));

    // log an example
    expect(metadata).toMatchSnapshot();
  });
  it('should be able to extract domain object metadata for a more complicated entity', () => {
    const program = ts.createProgram(
      [`${__dirname}/../__test_assets__/Item.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Item.ts'))!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const metadata = extractDomainObjectMetadataForDeclarationInFile({
      file,
      classDeclaration,
    });
    // console.log(JSON.stringify(metadata, null, 2));

    // log an example
    expect(metadata).toMatchSnapshot();
  });
});
