export enum DomainObjectPropertyType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ARRAY = 'ARRAY',
  REFERENCE = 'REFERENCE',
  ENUM = 'ENUM',
  /**
   * a primitive narrowed by a brand (e.g. `Uuid ⊂ string`) — see `DomainObjectNominalMetadata`.
   * carries both the base primitive and the brand name; "a string that remembers what it is".
   */
  NOMINAL = 'NOMINAL',
}
