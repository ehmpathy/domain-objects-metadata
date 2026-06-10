import ts, { isTypeAliasDeclaration } from 'typescript';

import { DomainObjectPropertyType } from '@src/domain.objects';

import { extractAliasMetadataFromAliasDeclaration } from './extractAliasMetadataFromAliasDeclaration';

describe('extractAliasMetadataFromEnumDeclaration', () => {
  it('should be able to get the type of an alias', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/PerformanceReport.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/PerformanceReport.ts'))!; // grab the right file
    const aliasDeclaration = file.statements.find(isTypeAliasDeclaration)!;
    const options = extractAliasMetadataFromAliasDeclaration(aliasDeclaration);
    console.log(options);

    expect(options).toEqual({
      name: 'StandardDate',
      primitive: DomainObjectPropertyType.STRING,
    });
  });
});
