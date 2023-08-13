export const isBsonType = (val: unknown, bsonType?: string) =>
  typeof val === "object" &&
  val !== null &&
  "_bsontype" in val &&
  (bsonType === undefined || val._bsontype === bsonType);
