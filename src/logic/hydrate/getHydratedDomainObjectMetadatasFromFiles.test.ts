import ts from 'typescript';
import { DomainObjectPropertyType } from '../../domain/objects/DomainObjectMetadata';
import { getHydratedDomainObjectMetadatasFromFiles } from './getHydratedDomainObjectMetadatasFromFiles';

describe('getHydratedDomainObjectMetadatasFromFiles', () => {
  it('should return metadata from files w/ no need for hydration', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Address.ts`], {});
    const files = program.getSourceFiles().filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));
    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files w/ has lots of imports and needs hydration of nested domain objects', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Order.ts`], {});
    const files = program.getSourceFiles().filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    expect(metadatas.length).toEqual(3); // shuld have got both the source and the references
    expect(metadatas[2].name).toEqual('Order');
    expect(metadatas[2].properties.destination).toMatchObject({ type: DomainObjectPropertyType.REFERENCE, of: { name: 'Address' } }); // nested metadata
    expect(metadatas[2].properties.items).toMatchObject({
      type: DomainObjectPropertyType.ARRAY,
      of: { type: DomainObjectPropertyType.REFERENCE, of: { name: 'Item' } }, // nested metadata in an array
    });

    expect(metadatas).toMatchSnapshot();
  });
  it('should return metadata from files which needs hydration of nested enum', () => {
    const program = ts.createProgram([`${__dirname}/../__test_assets__/Payment.ts`], {});
    const files = program.getSourceFiles().filter((file) => !file.fileName.includes('/node_modules/')); // skip the node modules
    const metadatas = getHydratedDomainObjectMetadatasFromFiles(files);
    // console.log(JSON.stringify(metadatas, null, 2));

    expect(metadatas[0].properties.status.type).toEqual(DomainObjectPropertyType.ENUM);
    expect(metadatas[0].properties.status.of).toEqual(['PENDING', 'COMPLETED', 'CANCELED']);

    expect(metadatas).toMatchSnapshot();
  });
});
