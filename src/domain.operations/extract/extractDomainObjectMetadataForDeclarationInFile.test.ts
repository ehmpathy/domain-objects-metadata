import { UnexpectedCodePathError } from 'helpful-errors';
import ts, { isClassDeclaration } from 'typescript';

import { DomainObjectPropertyType } from '@src/domain.objects';

import { extractDomainObjectMetadataForDeclarationInFile } from './extractDomainObjectMetadataForDeclarationInFile';

describe('extractDomainObjectMetadataForDeclarationInFile', () => {
  it('should be able to extract domain object metadata for simple literal', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Address.ts`],
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
      [`${__dirname}/../.test.assets/LoadingDock.ts`],
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
  it('should be able to extract domain object metadata for a literal with string literal unions', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/ClaimSearch.ts`],
      {},
    );
    const file =
      program
        .getSourceFiles()
        .find((thisFile) => thisFile.fileName.includes('/ClaimSearch.ts')) ??
      UnexpectedCodePathError.throw('test asset ClaimSearch.ts not found', {
        hint: 'ensure src/domain.operations/.test.assets/ClaimSearch.ts exists',
      });
    const classDeclaration =
      file.statements.find(isClassDeclaration) ??
      UnexpectedCodePathError.throw(
        'no class declaration found in ClaimSearch.ts',
        { hint: 'ensure ClaimSearch.ts declares `export class ClaimSearch`' },
      );
    const metadata = extractDomainObjectMetadataForDeclarationInFile({
      file,
      classDeclaration,
    });

    // string literal union extracts as STRING, required
    expect(metadata.properties.status).toMatchObject({
      type: DomainObjectPropertyType.STRING,
      nullable: false,
      required: true,
    });

    // nullable string literal union extracts as STRING, nullable
    expect(metadata.properties.verdict).toMatchObject({
      type: DomainObjectPropertyType.STRING,
      nullable: true,
      required: true,
    });

    // optional string literal union extracts as STRING, required false
    expect(metadata.properties.sortBy).toMatchObject({
      type: DomainObjectPropertyType.STRING,
      nullable: false,
      required: false,
    });

    // number literal union extracts as NUMBER
    expect(metadata.properties.priority).toMatchObject({
      type: DomainObjectPropertyType.NUMBER,
      nullable: false,
      required: true,
    });

    // boolean literal union extracts as BOOLEAN
    expect(metadata.properties.isActive).toMatchObject({
      type: DomainObjectPropertyType.BOOLEAN,
      nullable: false,
      required: true,
    });

    // array of literal union extracts as ARRAY of STRING
    expect(metadata.properties.tags).toMatchObject({
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.STRING,
        nullable: false,
        required: true,
      },
    });

    // log an example
    expect(metadata).toMatchSnapshot();
  });
  it('should be able to extract domain object metadata for a more complicated entity', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Item.ts`],
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
