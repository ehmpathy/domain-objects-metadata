import ts, { isInterfaceDeclaration } from 'typescript';
import { DomainObjectPropertyType } from '../../domain';
import { extractPropertiesFromInterfaceDeclaration } from './extractPropertiesFromInterfaceDeclaration';

describe('extractPropertiesFromInterfaceDeclaration', () => {
  it('should be able to extract properties from our Address interface. all strings', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Address.ts`], {});
    const file = program.getSourceFiles().find((thisFile) => thisFile.fileName.includes('/Address.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties = extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with all of the primitive types we support: number, string, boolean w/ required and optional combination', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/LoadingDock.ts`], {});
    const file = program.getSourceFiles().find((thisFile) => thisFile.fileName.includes('/LoadingDock.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties = extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));

    // prove we got every combo
    expect(Object.values(properties).map((property) => property.type)).toContain(DomainObjectPropertyType.STRING);
    expect(Object.values(properties).map((property) => property.type)).toContain(DomainObjectPropertyType.NUMBER);
    expect(Object.values(properties).map((property) => property.type)).toContain(DomainObjectPropertyType.BOOLEAN);
    expect(Object.values(properties).map((property) => property.required)).toContain(true);
    expect(Object.values(properties).map((property) => property.required)).toContain(false);
    expect(Object.values(properties).map((property) => property.nullable)).toContain(true);
    expect(Object.values(properties).map((property) => property.nullable)).toContain(false);

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with an array property', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Item.ts`], {});
    const file = program.getSourceFiles().find((thisFile) => thisFile.fileName.includes('/Item.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties = extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));

    // prove we got the array defined correctly
    const arrayProperty = Object.values(properties).find((property) => property.type === DomainObjectPropertyType.ARRAY);
    if (!arrayProperty) throw new Error('array property not defined');
    expect(arrayProperty.of).toEqual({ type: DomainObjectPropertyType.STRING, nullable: false, required: true });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface that references another interface or an array of interfaces', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Order.ts`], {});
    const file = program.getSourceFiles().find((thisFile) => thisFile.fileName.includes('/Order.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties = extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
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
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Payment.ts`], {});
    const file = program.getSourceFiles().find((thisFile) => thisFile.fileName.includes('/Payment.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties = extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));

    // prove we got the enum defined
    expect(properties.status).toMatchObject({
      type: DomainObjectPropertyType.REFERENCE, // notice how because it is a type reference, the most we can tell at this point is that its a reference. we'll have to hydrate to cast into enum
      of: 'PaymentStatus',
    });

    // save an example
    expect(properties).toMatchSnapshot();
  });
  it('should be able to extract properties from an interface with a date type', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/DeliveredEvent.ts`], {});
    const file = program.getSourceFiles().find((thisFile) => thisFile.fileName.includes('/DeliveredEvent.ts'))!; // grab the right file
    const interfaceDeclaration = file.statements.find(isInterfaceDeclaration)!;
    const properties = extractPropertiesFromInterfaceDeclaration(interfaceDeclaration);
    // console.log(JSON.stringify(properties, null, 2));

    // prove we got the enum defined
    expect(properties.occurredAt).toMatchObject({ type: DomainObjectPropertyType.DATE });

    // save an example
    expect(properties).toMatchSnapshot();
  });
});
