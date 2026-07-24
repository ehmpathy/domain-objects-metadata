import ts, { isInterfaceDeclaration } from 'typescript';

import { DomainObjectPropertyType } from '@src/domain.objects';

import { extractPropertiesFromInterfaceDeclaration } from './extractPropertiesFromInterfaceDeclaration';
import { knownNominals } from './knownNominals';

/**
 * exhaustive, divergent seaturtle-themed coverage: every known branded nominal
 * gets its own sea-world entity, extracted as NOMINAL that holds both the brand
 * name and the base primitive. one case per nominal — none proven by proxy.
 */

// load the zoo fixture once; each case reads its own interface out of it
const program = ts.createProgram(
  [`${__dirname}/../.test.assets/SeaTurtleNominalZoo.ts`],
  {},
);
const file = program
  .getSourceFiles()
  .find((thisFile) => thisFile.fileName.includes('/SeaTurtleNominalZoo.ts'))!;
const interfaces = file.statements.filter(isInterfaceDeclaration);

const getEntityProperties = (entityName: string) => {
  const declaration = interfaces.find(
    (thisInterface) => thisInterface.name.text === entityName,
  )!;
  return extractPropertiesFromInterfaceDeclaration(declaration);
};

const CASES: {
  entity: string;
  field: string;
  nominal: string;
  nullable: boolean;
  required: boolean;
}[] = [
  {
    entity: 'SeaTurtleTelemetry',
    field: 'payload',
    nominal: 'Serializable',
    nullable: false,
    required: true,
  },
  {
    entity: 'SeaTurtleTag',
    field: 'tagId',
    nominal: 'Uuid',
    nullable: false,
    required: true,
  },
  // ShellScuteScan.patternHash is optional (a scan may not have computed the hash yet)
  {
    entity: 'ShellScuteScan',
    field: 'patternHash',
    nominal: 'Hash',
    nullable: false,
    required: false,
  },
  // ReefCleanupInvoice.laborCost is nullable (cost not yet finalized)
  {
    entity: 'ReefCleanupInvoice',
    field: 'laborCost',
    nominal: 'IsoPrice',
    nullable: true,
    required: true,
  },
  {
    entity: 'KelpMarketOffer',
    field: 'askPrice',
    nominal: 'IsoPriceWords',
    nullable: false,
    required: true,
  },
  {
    entity: 'GiftShopPlushie',
    field: 'priceTag',
    nominal: 'IsoPriceHuman',
    nullable: false,
    required: true,
  },
  {
    entity: 'TurtleSpotEvent',
    field: 'observedAt',
    nominal: 'IsoTimeStamp',
    nullable: false,
    required: true,
  },
  {
    entity: 'HatchEvent',
    field: 'hatchedOn',
    nominal: 'IsoDateStamp',
    nullable: false,
    required: true,
  },
  {
    entity: 'MigrationSeason',
    field: 'peakMonth',
    nominal: 'IsoMonthStamp',
    nullable: false,
    required: true,
  },
  {
    entity: 'TagRecord',
    field: 'taggedYear',
    nominal: 'IsoYearStamp',
    nullable: false,
    required: true,
  },
  {
    entity: 'SurfaceBreath',
    field: 'breathedAt',
    nominal: 'IsoTimeFloat',
    nullable: false,
    required: true,
  },
  {
    entity: 'FeedWindow',
    field: 'opensAtHour',
    nominal: 'IsoHourFloat',
    nullable: false,
    required: true,
  },
  {
    entity: 'BreachAlert',
    field: 'detectedMinute',
    nominal: 'IsoMinuteFloat',
    nullable: false,
    required: true,
  },
  {
    entity: 'AlgaeBloom',
    field: 'peakMonthFloat',
    nominal: 'IsoMonthFloat',
    nullable: false,
    required: true,
  },
  {
    entity: 'LunarForage',
    field: 'dayOfMonth',
    nominal: 'IsoDayFloat',
    nullable: false,
    required: true,
  },
  {
    entity: 'PatrolShift',
    field: 'weekday',
    nominal: 'IsoWeekdayFloat',
    nullable: false,
    required: true,
  },
  {
    entity: 'DiveLog',
    field: 'diveDuration',
    nominal: 'IsoDuration',
    nullable: false,
    required: true,
  },
  {
    entity: 'RestInterval',
    field: 'restSpan',
    nominal: 'IsoDurationWords',
    nullable: false,
    required: true,
  },
];

describe('extractPropertiesFromInterfaceDeclaration - known branded nominals', () => {
  // structural tie: every registry entry must have its own fixture case, and vice versa.
  // guards the wish's core acceptance line ("every recognized nominal exhaustively covered —
  // no nominal proven by proxy") — a new registry nominal added without a fixture fails here,
  // rather than a silent regression of the coverage guarantee with no test to catch it.
  test('covers every knownNominals entry with exactly one fixture case (no nominal by proxy)', () => {
    expect([...CASES.map((thisCase) => thisCase.nominal)].sort()).toEqual(
      [...knownNominals.map((thisNominal) => thisNominal.name)].sort(),
    );
  });

  CASES.forEach((thisCase) => {
    test(`extracts ${thisCase.entity}.${thisCase.field} (${thisCase.nominal}) as NOMINAL`, () => {
      const properties = getEntityProperties(thisCase.entity);

      // the branded field extracts as NOMINAL that holds brand name + base primitive
      expect(properties[thisCase.field]).toMatchObject({
        name: thisCase.field,
        type: DomainObjectPropertyType.NOMINAL,
        of: {
          name: thisCase.nominal,
          primitive: DomainObjectPropertyType.STRING,
        },
        nullable: thisCase.nullable,
        required: thisCase.required,
      });

      // snapshot the full property map for visual spotcheck
      expect(properties).toMatchSnapshot();
    });
  });

  test('extracts an array of a nominal (DiveLog.buddyTagIds: Uuid[]) as ARRAY of NOMINAL', () => {
    const properties = getEntityProperties('DiveLog');

    // array of a branded nominal extracts as ARRAY whose element is the NOMINAL
    expect(properties.buddyTagIds).toMatchObject({
      type: DomainObjectPropertyType.ARRAY,
      of: {
        type: DomainObjectPropertyType.NOMINAL,
        of: {
          name: 'Uuid',
          primitive: DomainObjectPropertyType.STRING,
        },
        nullable: false,
        required: true,
      },
      nullable: false,
      required: true,
    });

    // snapshot for review
    expect(properties.buddyTagIds).toMatchSnapshot();
  });

  // deliberately out of scope: object-shaped types stay REFERENCE (structure, not one branded value)
  const OUT_OF_SCOPE_CASES: {
    entity: string;
    field: string;
    shape: string;
  }[] = [
    { entity: 'ReefCleanupQuote', field: 'priceShape', shape: 'IsoPriceShape' },
    { entity: 'DiveSession', field: 'window', shape: 'IsoTimeStampRange' },
    { entity: 'ClutchWatch', field: 'span', shape: 'IsoDateStampRange' },
    {
      entity: 'FastCurrentDrift',
      field: 'durationShape',
      shape: 'IsoDurationShape',
    },
  ];

  OUT_OF_SCOPE_CASES.forEach((thisCase) => {
    test(`keeps out-of-scope ${thisCase.shape} (${thisCase.entity}.${thisCase.field}) as REFERENCE, not NOMINAL`, () => {
      const properties = getEntityProperties(thisCase.entity);

      // object-shaped types are not in the registry -> fall through to REFERENCE
      expect(properties[thisCase.field]).toMatchObject({
        name: thisCase.field,
        type: DomainObjectPropertyType.REFERENCE,
        of: thisCase.shape, // pre-hydration REFERENCE holds the referenced type name as a string
        nullable: false,
        required: true,
      });

      // snapshot the boundary for review
      expect(properties[thisCase.field]).toMatchSnapshot();
    });
  });
});
