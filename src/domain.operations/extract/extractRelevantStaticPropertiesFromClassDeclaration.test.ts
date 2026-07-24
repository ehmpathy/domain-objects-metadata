import ts, { isClassDeclaration } from 'typescript';

import { extractRelevantStaticPropertiesFromClassDeclaration } from './extractRelevantStaticPropertiesFromClassDeclaration';

describe('extractRelevantStaticPropertiesFromClassDeclaration', () => {
  it('should be able to get the unique and updatable properties of a DomainEntity', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Payment.ts`],
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
      origin: null,
      alias: null,
      primary: null,
      unique: ['externalId'],
      updatable: ['status', 'amount', 'currency'],
    });
  });
  it('should be able to get the unique and updatable properties of a DomainLiteral', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Address.ts`],
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
      origin: null,
      alias: null,
      primary: null,
      unique: null,
      updatable: null,
    });
  });
  it('should be able to get the primary, unique, and updatable properties of a DomainEntity with primary and unique keys as const', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/SeaTurtle.ts`],
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
      origin: null,
      alias: null,
      primary: ['uuid'],
      unique: ['seawaterSecurityNumber'],
      updatable: ['name'],
    });
  });
  it('should be able to get the alias, unique, and updatable properties of a DomainEntity with an alias', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/AsyncTaskDoCoolStuff.ts`],
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
      origin: null,
      alias: 'task',
      primary: null,
      unique: ['targetExid'],
      updatable: null,
    });
  });
  it('should be able to get the alias property of a DomainEntity with an alias declared `as const`', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/AsyncTaskRideWaves.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) =>
        thisFile.fileName.includes('/AsyncTaskRideWaves.ts'),
      )!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const options =
      extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);
    expect(options).toEqual({
      origin: null,
      alias: 'task',
      primary: null,
      unique: ['targetExid'],
      updatable: null,
    });
  });
  it('should be able to get the origin property of a DomainEntity with an origin declared `as const`', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/SvcHomeServicesHomeService.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) =>
        thisFile.fileName.includes('/SvcHomeServicesHomeService.ts'),
      )!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const options =
      extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);
    expect(options).toEqual({
      origin: 'ahbode/svc-home-services',
      alias: null,
      primary: ['uuid'],
      unique: ['slug'],
      updatable: [],
    });
  });
  it('should be able to get the origin property of a DomainEntity with an origin declared as a bare string', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/SeaShell.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/SeaShell.ts'))!; // grab the right file
    const classDeclaration = file.statements.find(isClassDeclaration)!;
    const options =
      extractRelevantStaticPropertiesFromClassDeclaration(classDeclaration);
    expect(options).toEqual({
      origin: 'ehmpathy/svc-sea-registry',
      alias: null,
      primary: ['uuid'],
      unique: ['serialNumber'],
      updatable: ['color'],
    });
  });
});
