import ts, { isClassDeclaration } from 'typescript';

import { extractRelevantStaticPropertiesFromClassDeclaration } from './extractRelevantStaticPropertiesFromClassDeclaration';

describe('extractRelevantStaticPropertiesFromClassDeclaration', () => {
  it('should be able to get the unique and updatable properties of a DomainEntity', () => {
    const program = ts.createProgram(
      [`${__dirname}/../__test_assets__/Payment.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Payment.ts'))!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const options =
      extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);
    // console.log(options);
    expect(options).toEqual({
      alias: null,
      unique: ['externalId'],
      updatable: ['status', 'amount', 'currency'],
    });
  });
  it('should be able to get the unique and updatable properties of a DomainLiteral', () => {
    const program = ts.createProgram(
      [`${__dirname}/../__test_assets__/Address.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Address.ts'))!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const options =
      extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);
    // console.log(options);
    expect(options).toEqual({
      alias: null,
      unique: null,
      updatable: null,
    });
  });
  it('should be able to get the unique and updatable properties of a DomainEntity with unique key as const', () => {
    const program = ts.createProgram(
      [`${__dirname}/../__test_assets__/SeaTurtle.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/SeaTurtle.ts'))!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const options =
      extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);
    // console.log(options);
    expect(options).toEqual({
      alias: null,
      unique: ['seawaterSecurityNumber'],
      updatable: ['name'],
    });
  });
  it('should be able to get the alias, unique, and updatable properties of a DomainEntity with an alias', () => {
    const program = ts.createProgram(
      [`${__dirname}/../__test_assets__/AsyncTaskDoCoolStuff.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) =>
        thisFile.fileName.includes('/AsyncTaskDoCoolStuff.ts'),
      )!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const options =
      extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);
    expect(options).toEqual({
      alias: 'task',
      unique: ['targetExid'],
      updatable: null,
    });
  });
});
