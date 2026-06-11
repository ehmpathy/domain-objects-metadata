import { BadRequestError, UnexpectedCodePathError } from 'helpful-errors';
import { getError } from 'test-fns';
import ts, { isInterfaceDeclaration } from 'typescript';

import { DomainObjectPropertyType } from '@src/domain.objects';

import { extractPropertiesFromInterfaceDeclaration } from './extractPropertiesFromInterfaceDeclaration';

describe('extractPropertiesFromInterfaceDeclaration', () => {
  it('should be able to extract properties from our Address interface. all strings', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Address.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Address.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);

    // verify all properties are strings
    expect(
      Object.values(properties).every(
        (p) => p.type === DomainObjectPropertyType.STRING,
      ),
    ).toBe(true);
    expect(Object.keys(properties).length).toBeGreaterThan(0);

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with all of the primitive types we support: number, string, boolean w/ required and optional combination', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/LoadingDock.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/LoadingDock.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));

    // prove we got every combo
    expect(
      Object.values(properties).map((property) => property.type),
    ).toContain(DomainObjectPropertyType.STRING);
    expect(
      Object.values(properties).map((property) => property.type),
    ).toContain(DomainObjectPropertyType.NUMBER);
    expect(
      Object.values(properties).map((property) => property.type),
    ).toContain(DomainObjectPropertyType.BOOLEAN);
    expect(
      Object.values(properties).map((property) => property.required),
    ).toContain(true);
    expect(
      Object.values(properties).map((property) => property.required),
    ).toContain(false);
    expect(
      Object.values(properties).map((property) => property.nullable),
    ).toContain(true);
    expect(
      Object.values(properties).map((property) => property.nullable),
    ).toContain(false);

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with an array property', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Item.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Item.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));

    // prove we got the array defined correctly
    const arrayProperty = Object.values(properties).find(
      (property) => property.type === DomainObjectPropertyType.ARRAY,
    );
    if (!arrayProperty)
      throw new UnexpectedCodePathError('array property not defined', {
        properties,
      });
    expect(arrayProperty.of).toEqual({
      type: DomainObjectPropertyType.STRING,
      nullable: false,
      required: true,
    });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface that references another interface or an array of interfaces', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Order.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Order.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));

    // prove we got the nested interfaces defined referenced correctly
    expect(properties.destination).toMatchObject({
      type: DomainObjectPropertyType.REFERENCE,
      of: 'Address',
    });
    expect(properties.items).toMatchObject({
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.REFERENCE,
        of: 'Item',
      },
    });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with an enum', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Payment.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/Payment.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);

    // verify properties were extracted
    expect(Object.keys(properties).length).toBeGreaterThan(0);

    // verify enum reference is correctly typed
    expect(properties.status).toMatchObject({
      type: DomainObjectPropertyType.REFERENCE, // notice how because it is a type reference, the most we can tell at this point is that its a reference. we'll have to hydrate to cast into enum
      of: 'PaymentStatus',
    });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with a date type', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/DeliveredEvent.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/DeliveredEvent.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);

    // verify properties were extracted
    expect(Object.keys(properties).length).toBeGreaterThan(0);

    // verify date type is correctly identified
    expect(properties.occurredAt).toMatchObject({
      type: DomainObjectPropertyType.DATE,
    });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with a ref type', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/SeaGuide.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/SeaGuide.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);

    // verify properties were extracted
    expect(Object.keys(properties).length).toBeGreaterThan(0);

    // verify ref type is correctly identified
    expect(properties.turtle).toMatchObject({
      type: DomainObjectPropertyType.REFERENCE,
      of: 'SeaTurtle',
    });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with string literal unions', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/ClaimSearch.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/ClaimSearch.ts'))!;
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties =
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);

    // string literal union extracts as STRING
    expect(properties.status).toMatchObject({
      type: DomainObjectPropertyType.STRING,
      nullable: false,
      required: true,
    });

    // nullable string literal union extracts as STRING, nullable
    expect(properties.verdict).toMatchObject({
      type: DomainObjectPropertyType.STRING,
      nullable: true,
      required: true,
    });

    // single string literal extracts as STRING
    expect(properties.mode).toMatchObject({
      type: DomainObjectPropertyType.STRING,
      nullable: false,
      required: true,
    });

    // number literal union extracts as NUMBER
    expect(properties.priority).toMatchObject({
      type: DomainObjectPropertyType.NUMBER,
      nullable: false,
      required: true,
    });

    // boolean literal union extracts as BOOLEAN
    expect(properties.isActive).toMatchObject({
      type: DomainObjectPropertyType.BOOLEAN,
      nullable: false,
      required: true,
    });

    // regular string still works
    expect(properties.name).toMatchObject({
      type: DomainObjectPropertyType.STRING,
      nullable: false,
      required: true,
    });

    // array of literal union extracts as ARRAY of STRING
    expect(properties.tags).toMatchObject({
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.STRING,
        nullable: false,
        required: true,
      },
    });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should throw on mixed literal union (e.g., string | number)', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/MixedLiteralUnion.ts`],
      {},
    );
    const file = program
      .getSourceFiles()
      .find((thisFile) => thisFile.fileName.includes('/MixedLiteralUnion.ts'))!;
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;

    // capture the error
    const error = getError(() =>
      extractPropertiesFromInterfaceDeclaration(interfaceDeclaration),
    );

    // verify it is the correct error class
    expect(error).toBeInstanceOf(BadRequestError);

    // snapshot the error message for review
    expect(error.message).toMatchSnapshot();
  });
});
