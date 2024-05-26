# domain-objects-metadata

![ci_on_commit](https://github.com/uladkasach/domain-objects-metadata/workflows/ci_on_commit/badge.svg)
![deploy_on_tag](https://github.com/uladkasach/domain-objects-metadata/workflows/deploy_on_tag/badge.svg)

Extract domain information from your domain-object definitions using type introspection.

# Purpose

Your [domain-objects](https://github.com/uladkasach/domain-objects) encode a lot of information about your domain in their definition. This information can be used by other libraries to generate code, make decisions, and much more.

# Install

```sh
npm install --save domain-objects-metadata
```

# Usage Examples

### metadata of a literal

say you've defined an `Address` as one of the objects in your domain

```ts
// src/domain/objects/Address.ts

import { DomainLiteral } from 'domain-objects';

interface Address {
  street: string;
  suite: string | null;
  city: string;
  state: string;
  postal: string;
}
class Address extends DomainLiteral<Address> implements Address {}
```

you can introspect the file that its defined in to get its metadata

```ts
import { introspect } from 'domain-objects-metadata';

const [metadata] = introspect('src/domain/objects/Address.ts');
```

which looks like

```ts
{
  name: 'Address',
  extends:  'DomainLiteral',
  properties: {
    street: { name: 'street', type: 'string', required: true },
    suite: { name: 'suite', type: 'string', nullable: true, required: true },
    city: { name: 'city', type: 'string', required: true },
    state: { name: 'state', type: 'string', required: true },
    postal: { name: 'postal', type: 'string', required: true }
  },
  decorations: {
    unique: null,
    updatable: null,
  }
}
```

### metadata of an entity

entities often explicitly include decorations about themselves. for example:
- which properties they are unique on
- which properties are updatable

this information is, as you'd expect, exposed in the domain object metadata.

for example, say you're talking about a `DeliveryVan`

```ts
// src/domain/objects/DeliveryVan.ts

interface DeliveryVan {
  id?: number;
  uuid?: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  milage: number;
}
class DeliveryVan extends DomainEntity<DeliveryVan> implements DeliveryVan {
  public static unique = ['vin']; // vans are uniquely identified by their vin
  public static updatable = ['milage'] // the milage on vans is updated at the end of each delivery day
}
```

extract the metadata like usual by specifying where we should look for the domain object

```ts
import { introspect } from 'domain-objects-metadata';

const [metadata] = introspect('src/domain/objects/DeliveryVan.ts');
```

which looks like

```ts
{
  name: 'DeliveryVan',
  extends:  'DomainEntity',
  properties: {
    id: { name: 'id', type: 'number', required: false },
    uuid: { name: 'uuid', type: 'string', required: false },
    vin: { name: 'vin', type: 'string', required: true },
    make: { name: 'make', type: 'string', required: true },
    model: { name: 'model', type: 'string', required: true },
    year: { name: 'year', type: 'number', required: true },
    milage: { name: 'milage', type: 'number', required: true },
  },
  decorations: {
    unique: ['vin'],
    updatable: ['milage']
  }
}
```

### metadata of more complicated objects

domain objects can have many features:
- properties which are arrays
- properties which reference other domain objects
- properties which are values of an enum
- not being uniquely identified by any natural keys
- etc

type introspection supports these cases and more.

for example, say we now want to track deliveries

```ts
// src/domain/object/Delivery.ts

enum DeliveryStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}
interface Delivery {
  id?: number;
  uuid?: string;
  van: DeliveryVan;
  destination: Address;
  contactInfo: string[];
  packages: Package[];
  status: DeliveryStatus;
}
class Delivery extends DomainEntity<Delivery> implements Delivery {
  public static unique = []; // deliveries are not uniquely identified by any of their natural keys
  public static updatable = ['status', 'contactInfo'] // the status and contactInfo of a delivery are updatable
}
```

extract the metadata like usual by specifying where we should look for the domain object

```ts
import { introspect } from 'domain-objects-metadata';

const metadatas = introspect('src/domain/objects/Delivery.ts'); // type introspection will look at all of the domain objects in or imported by the file
const metadata = metadatas.find(metadata => metadata.name === 'Delivery'); // therefore we have to filter down which one we're interested in
```

which looks like

```ts
{
  name: 'Delivery',
  extends:  'DomainEntity',
  properties: {
    id: { name: 'id', type: 'number', required: false },
    uuid: { name: 'uuid', type: 'string', required: false },
    van: {
      name: 'van',
      type: 'reference', // notice how the nested reference is represented
      of: { name: 'DeliveryVan', extends: 'DomainEntity' },
      required: true,
    },
    destination: {
      name: 'destination',
      type: 'reference',
      of: { name: 'Address', extends: 'DomainLiteral' },
      required: true,
    },
    contactInfo: {
      name: 'contactInfo',
      type: 'array', // notice how the array is represented
      of: { type: 'string', required: true },
      required: true,
    },
    packages: {
      name: 'packages',
      type: 'array', // notice how the above two cases compose together; array of references
      of: {
        type: 'reference',
        of: { name: 'Package', extends: 'DomainEntity' },
        required: true,
      },
      required: true,
    },
    status: {
      name: 'status',
      type: 'enum', // notice how the options of the enum are referenced
      of: ['SCHEDULED', 'IN_PROGRESS', ...],
      required: true,
    },
  },
  decorations: {
    unique: [],
    updatable: ['status', 'contactInfo']
  }
}
```

# references

helpful references:
- https://medium.com/basecs/leveling-up-ones-parsing-game-with-asts-d7a6fc2400ff
- https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
