import { UnexpectedCodePathError } from 'helpful-errors';
import ts from 'typescript';

import {
  DomainObjectPropertyType,
  DomainObjectVariant,
} from '@src/domain.objects';
import { extractRelevantProgramSourceFiles } from '@src/domain.operations/extractRelevantProgramSourceFiles';
import { isEnumArrayProperty } from '@src/domain.operations/guard/isEnumArrayProperty';
import { isPrimitiveArrayProperty } from '@src/domain.operations/guard/isPrimitiveArrayProperty';
import { isReferenceArrayProperty } from '@src/domain.operations/guard/isReferenceArrayProperty';

import { getHydratedDomainObjectMetadatasFromFiles } from './getHydratedDomainObjectMetadatasFromFiles';

describe('getHydratedDomainObjectMetadatasFromFiles', () => {
  it('should return metadata from files w/ no need for hydration', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Address.ts`],
      {},
    );
    const files = program
      .getSourceFiles()
      .filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));
    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files w/ has lots of imports and needs hydration of nested domain objects', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Order.ts`],
      {},
    );
    const files = program
      .getSourceFiles()
      .filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    // check that it has everything we expected
    expect(metadatas.length).toEqual(3); // shuld have got both the source and the references
    expect(metadatas[2]?.name).toEqual('Order');
    expect(metadatas[2]?.properties.destination).toMatchObject({
      type: DomainObjectPropertyType.REFERENCE,
      of: { name: 'Address' },
    }); // nested metadata
    expect(metadatas[2]?.properties.items).toMatchObject({
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.REFERENCE, of: { name: 'Item' } }, // nested metadata in an array
    });

    // ensure: the nested referenced metadata should not include the full reference. (i.e., no properties / decorations on it)
    expect(metadatas[2]?.properties.destination?.of).not.toHaveProperty(
      'properties',
    );
    expect(metadatas[2]?.properties.destination?.of).not.toHaveProperty(
      'decorations',
    );

    // log an example
    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which needs hydration of nested enum', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Payment.ts`],
      {},
    );
    const files = program
      .getSourceFiles()
      .filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    expect(metadatas[0]?.properties.status?.type).toEqual(
      DomainObjectPropertyType.ENUM,
    );
    expect(metadatas[0]?.properties.status?.of).toEqual([
      'PENDING',
      'COMPLETED',
      'CANCELED',
    ]);

    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which needs hydration of nested type alias', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/PerformanceReport.ts`],
      {},
    );
    const files = program
      .getSourceFiles()
      .filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    expect(metadatas[0]?.properties.onDate?.type).toEqual(
      DomainObjectPropertyType.STRING,
    );
    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which needs hydration of nested enum array', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/AgentRole.ts`],
      {},
    );
    const files = program
      .getSourceFiles()
      .filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);

    expect(metadatas[0]?.properties.permissions?.type).toEqual(
      DomainObjectPropertyType.ARRAY,
    );
    expect((metadatas[0]?.properties.permissions?.of as any).type).toEqual(
      DomainObjectPropertyType.ENUM,
    );

    // prove the guard classifies the hydrated enum array correctly (extract→hydrate→classify seam)
    const permissions = metadatas[0]?.properties.permissions;
    if (!permissions)
      throw new UnexpectedCodePathError(
        'permissions property absent post-hydration',
        {
          available: Object.keys(metadatas[0]?.properties ?? {}),
          hint: 'the AgentRole test asset declares permissions: AgentPermission[]',
        },
      ); // fail loud
    expect(isEnumArrayProperty(permissions)).toEqual(true);
    expect(isPrimitiveArrayProperty(permissions)).toEqual(false);
    expect(isReferenceArrayProperty(permissions)).toEqual(false);

    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which needs hydration of enum from another package', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/AsyncTaskDoCoolStuff.ts`],
      {},
    );
    const files = extractRelevantProgramSourceFiles(program.getSourceFiles());
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    expect(metadatas[0]?.properties.status?.type).toEqual(
      DomainObjectPropertyType.ENUM,
    );
    expect(metadatas[0]?.properties.status?.of).toEqual([
      'HALTED',
      'SCHEDULED',
      'QUEUED',
      'ATTEMPTED',
      'FULFILLED',
      'FAILED',
      'CANCELED',
    ]);
    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which reference a generic type modifier from a package plugin, Literalize', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/Nutrient.ts`],
      {},
    );
    const files = extractRelevantProgramSourceFiles(program.getSourceFiles());
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    expect(metadatas[0]?.properties.variant?.type).toEqual(
      DomainObjectPropertyType.ENUM,
    );
    expect(metadatas[0]?.properties.variant?.of).toEqual([
      'PROTEIN',
      'VITAMIN',
      'MINERAL',
      'CARBOHYDRATE',
    ]);
    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which reference a generic type modifier from a package plugin, UniDateTime', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/NutrientResearchPublicationEvent.ts`],
      {},
    );
    const files = extractRelevantProgramSourceFiles(program.getSourceFiles());
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    expect(metadatas[1]?.properties.occurredAt?.type).toEqual(
      DomainObjectPropertyType.STRING,
    );
    expect(metadatas).toMatchSnapshot();
  });
  it('should hydrate primitive arrays so they classify as primitive-array properties (extract→hydrate→classify seam)', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/PrimitiveArrays.ts`],
      {},
    );
    const files = program
      .getSourceFiles()
      .filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);

    // grab the hydrated PrimitiveArrays metadata
    const primitiveArrays = metadatas.find(
      (metadata) => metadata.name === 'PrimitiveArrays',
    );
    if (!primitiveArrays)
      throw new UnexpectedCodePathError(
        'PrimitiveArrays metadata absent post-hydration',
        {
          asset: 'PrimitiveArrays.ts',
          names: metadatas.map((metadata) => metadata.name),
          hint: 'extract+hydrate should always yield PrimitiveArrays from the test asset',
        },
      ); // fail loud

    // prove each primitive-array element survives hydration and classifies correctly
    const expectedElementTypes: Record<string, DomainObjectPropertyType> = {
      tags: DomainObjectPropertyType.STRING,
      scores: DomainObjectPropertyType.NUMBER,
      flags: DomainObjectPropertyType.BOOLEAN,
      occurredAts: DomainObjectPropertyType.DATE,
    };
    for (const [propName, elementType] of Object.entries(
      expectedElementTypes,
    )) {
      const property = primitiveArrays.properties[propName];
      if (!property)
        throw new UnexpectedCodePathError(
          'primitive-array property absent post-hydration',
          {
            property: propName,
            available: Object.keys(primitiveArrays.properties),
            hint: 'the PrimitiveArrays test asset declares this property; extract+hydrate should preserve it',
          },
        ); // fail loud

      // classify: primitive-array guard says yes, the other two say no (3-way exclusivity)
      expect(isPrimitiveArrayProperty(property)).toEqual(true);
      expect(isReferenceArrayProperty(property)).toEqual(false);
      expect(isEnumArrayProperty(property)).toEqual(false);

      // the guard narrows `of`, so we can read the element type without a cast
      if (isPrimitiveArrayProperty(property))
        expect(property.of.type).toEqual(elementType);
    }

    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which reference a Reference<> type from domain-objects', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/SeaGuide.ts`],
      {},
    );
    const files = extractRelevantProgramSourceFiles(program.getSourceFiles());
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);

    expect(metadatas[1]?.properties.turtle?.type).toEqual(
      DomainObjectPropertyType.REFERENCE,
    );
    expect(metadatas[1]?.properties.turtle?.of).toEqual({
      name: 'SeaTurtle',
      extends: DomainObjectVariant.DOMAIN_ENTITY,
    });
    expect(metadatas).toMatchSnapshot();
  });
  it('should classify an array of by-uuid references as a reference array', () => {
    const program = ts.createProgram(
      [`${__dirname}/../.test.assets/SeaSquad.ts`],
      {},
    );
    const files = extractRelevantProgramSourceFiles(program.getSourceFiles());
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);

    // members: Ref<typeof SeaTurtle>[] → a by-uuid-ref array collapses to a REFERENCE array,
    // classified identically to a nested domain-object array (proves the guard's cross-shape claim)
    const squad = metadatas.find((metadata) => metadata.name === 'SeaSquad');
    if (!squad)
      throw new UnexpectedCodePathError(
        'expected a SeaSquad metadata post-hydration',
        {
          names: metadatas.map((metadata) => metadata.name),
          hint: 'check that .test.assets/SeaSquad.ts still declares the SeaSquad interface',
        },
      );
    const members = squad.properties.members;
    if (!members)
      throw new UnexpectedCodePathError(
        'expected a members property on SeaSquad post-hydration',
        {
          available: Object.keys(squad.properties),
          hint: 'check that SeaSquad.ts still declares members: Ref<typeof SeaTurtle>[]',
        },
      );
    expect(isReferenceArrayProperty(members)).toEqual(true);
    expect(isPrimitiveArrayProperty(members)).toEqual(false);
    expect(isEnumArrayProperty(members)).toEqual(false);

    expect(metadatas).toMatchSnapshot();
  });
});
