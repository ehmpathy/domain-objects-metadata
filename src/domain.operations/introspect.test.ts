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
});
