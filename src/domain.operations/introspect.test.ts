import { UnexpectedCodePathError } from 'helpful-errors';

import { DomainObjectPropertyType } from '@src/domain.objects';

import { isEnumArrayProperty } from './guard/isEnumArrayProperty';
import { isPrimitiveArrayProperty } from './guard/isPrimitiveArrayProperty';
import { isReferenceArrayProperty } from './guard/isReferenceArrayProperty';
import { introspect } from './introspect';

describe('introspect', () => {
  it('should be possible to introspect the Address file', () => {
    const metadatas = introspect(`${__dirname}/.test.assets/Address.ts`);
    // console.log(JSON.stringify(metadatas, null, 2));
    expect(metadatas.length).toEqual(1);
    expect(metadatas).toMatchSnapshot();
  });
  it('should be possible to introspect the DeliveryVan file', () => {
    const metadatas = introspect(`${__dirname}/.test.assets/DeliveryVan.ts`);
    // console.log(JSON.stringify(metadatas, null, 2));
    expect(metadatas.length).toEqual(1);
    expect(metadatas).toMatchSnapshot();
  });
  it('should be possible to introspect the Delivery file', () => {
    const metadatas = introspect(`${__dirname}/.test.assets/Delivery.ts`);
    // console.log(JSON.stringify(metadatas, null, 2));
    expect(metadatas.length).toEqual(4);
    expect(metadatas).toMatchSnapshot();
  });
  it('should be possible to introspect a file for an entity owned by another service via origin', () => {
    const metadatas = introspect(
      `${__dirname}/.test.assets/SvcHomeServicesHomeService.ts`,
    );
    // console.log(JSON.stringify(metadatas, null, 2));
    expect(metadatas.length).toEqual(1);
    expect(metadatas[0]?.decorations.origin).toEqual(
      'ahbode/svc-home-services',
    );
    expect(metadatas).toMatchSnapshot();
  });
  it('should be possible to introspect all of those files at the same time', () => {
    const metadatas = introspect([
      `${__dirname}/.test.assets/Delivery.ts`,
      `${__dirname}/.test.assets/Address.ts`,
      `${__dirname}/.test.assets/DeliveryVan.ts`,
    ]);
    // console.log(JSON.stringify(metadatas, null, 2));
    expect(metadatas.length).toEqual(4);
    expect(metadatas).toMatchSnapshot();
  });
  it('should classify introspected array properties via the exported guards (public contract journey)', () => {
    // this proves the wish end-to-end: a consumer calls introspect() then the exported
    // guards on the real hydrated output — not on synthetic inline metadata
    const metadatas = introspect(`${__dirname}/.test.assets/Delivery.ts`);
    const delivery = metadatas.find((metadata) => metadata.name === 'Delivery');
    if (!delivery)
      throw new UnexpectedCodePathError(
        'expected a Delivery metadata from introspect',
        {
          names: metadatas.map((metadata) => metadata.name),
          hint: 'check that .test.assets/Delivery.ts still declares the Delivery interface',
        },
      );

    // contactInfo: string[] → primitive array (json/text column)
    const contactInfo = delivery.properties.contactInfo;
    if (!contactInfo)
      throw new UnexpectedCodePathError(
        'expected a contactInfo property on Delivery',
        {
          keys: Object.keys(delivery.properties),
          hint: 'check that Delivery.ts still declares contactInfo: string[]',
        },
      );
    expect(isPrimitiveArrayProperty(contactInfo)).toBe(true);
    expect(isReferenceArrayProperty(contactInfo)).toBe(false);
    expect(isEnumArrayProperty(contactInfo)).toBe(false);

    // packages: Package[] → domain-object reference array (relation)
    const packages = delivery.properties.packages;
    if (!packages)
      throw new UnexpectedCodePathError(
        'expected a packages property on Delivery',
        {
          keys: Object.keys(delivery.properties),
          hint: 'check that Delivery.ts still declares packages: Package[]',
        },
      );
    expect(isReferenceArrayProperty(packages)).toBe(true);
    expect(isPrimitiveArrayProperty(packages)).toBe(false);
    expect(isEnumArrayProperty(packages)).toBe(false);

    // prove the positive enum-array case through the same public entrypoint:
    // AgentRole.permissions: AgentPermission[] → enum array (native enum[] column)
    const roleMetadatas = introspect(`${__dirname}/.test.assets/AgentRole.ts`);
    const role = roleMetadatas.find(
      (metadata) => metadata.name === 'AgentRole',
    );
    if (!role)
      throw new UnexpectedCodePathError(
        'expected an AgentRole metadata from introspect',
        {
          names: roleMetadatas.map((metadata) => metadata.name),
          hint: 'check that .test.assets/AgentRole.ts still declares the AgentRole interface',
        },
      );
    const permissions = role.properties.permissions;
    if (!permissions)
      throw new UnexpectedCodePathError(
        'expected a permissions property on AgentRole',
        {
          keys: Object.keys(role.properties),
          hint: 'check that AgentRole.ts still declares permissions: AgentPermission[]',
        },
      );
    expect(isEnumArrayProperty(permissions)).toBe(true);
    expect(isPrimitiveArrayProperty(permissions)).toBe(false);
    expect(isReferenceArrayProperty(permissions)).toBe(false);

    // negative guard: a scalar enum (status: DeliveryStatus) is not an array of any kind
    const status = delivery.properties.status;
    if (!status)
      throw new UnexpectedCodePathError(
        'expected a status property on Delivery',
        {
          keys: Object.keys(delivery.properties),
          hint: 'check that Delivery.ts still declares status: DeliveryStatus',
        },
      );
    expect(isEnumArrayProperty(status)).toBe(false);
    expect(isPrimitiveArrayProperty(status)).toBe(false);
    expect(isReferenceArrayProperty(status)).toBe(false);
  });
  it('should extract an element-level primitive union array (string | null)[] as a primitive array of STRING', () => {
    // the homogeneous-union support now collapses (string | null) to STRING per the vision,
    // and array-element nulls are filtered out, so (string | null)[] classifies as a primitive array
    const metadatas = introspect(
      `${__dirname}/.test.assets/PrimitiveNullableUnionArray.ts`,
    );
    const asset = metadatas.find(
      (metadata) => metadata.name === 'PrimitiveNullableUnionArray',
    );
    if (!asset)
      throw new UnexpectedCodePathError(
        'expected a PrimitiveNullableUnionArray metadata from introspect',
        {
          names: metadatas.map((metadata) => metadata.name),
          hint: 'check that .test.assets/PrimitiveNullableUnionArray.ts still declares the interface',
        },
      );
    const values = asset.properties.values;
    if (!values)
      throw new UnexpectedCodePathError(
        'expected a values property on PrimitiveNullableUnionArray',
        {
          keys: Object.keys(asset.properties),
          hint: 'check that PrimitiveNullableUnionArray.ts still declares values: (string | null)[]',
        },
      );

    // classifies as a primitive array through the public guards
    expect(isPrimitiveArrayProperty(values)).toBe(true);
    expect(isReferenceArrayProperty(values)).toBe(false);
    expect(isEnumArrayProperty(values)).toBe(false);

    // the element collapses to STRING (the null member is filtered out)
    expect(values.of).toMatchObject({ type: DomainObjectPropertyType.STRING });
  });
  it('should throw (not silently degrade) for a named type-alias array Variant[] — a prior hydration limitation', () => {
    // documents the ACTUAL behavior: hydration throws before any guard runs.
    // the vision claimed the alias collapses to STRING; it does not. asserted per rule.forbid.failhide
    expect(() =>
      introspect(`${__dirname}/.test.assets/NamedAliasArray.ts`),
    ).toThrow(UnexpectedCodePathError);
  });
});
