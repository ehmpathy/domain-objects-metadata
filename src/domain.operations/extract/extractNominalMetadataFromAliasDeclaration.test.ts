import ts, { isTypeAliasDeclaration } from 'typescript';

import { DomainObjectPropertyType } from '@src/domain.objects';

import { extractNominalMetadataFromAliasDeclaration } from './extractNominalMetadataFromAliasDeclaration';

describe('extractNominalMetadataFromAliasDeclaration', () => {
  it('should be able to get the nominal metadata from a type alias declaration', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/PerformanceReport.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/PerformanceReport.ts'))!; // grab the right file
    const aliasDeclaration = file.statements.find(isTypeAliasDeclaration)!;
    const options =
      extractNominalMetadataFromAliasDeclaration(aliasDeclaration);
    console.log(options);

    expect(options).toEqual({
      name: 'StandardDate',
      primitive: DomainObjectPropertyType.STRING,
    });
  });
});
