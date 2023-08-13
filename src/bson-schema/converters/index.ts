export { convertObject, ObjectBSONSchema } from "./object";
export { convertString, StringBSONSchema } from "./string";
export { convertObjectId, ObjectIdBSONSchema } from "./objectId";
export { convertNumber, NumberBSONSchema } from "./number";
export { convertBool, BoolBSONSchema } from "./bool";
export { convertArray, ArrayBSONSchema } from "./array";
export { convertTuple } from "./tuple";
export { convertSet } from "./set";
export { convertNullable, NullableBSONSchema } from "./nullable";
export { convertNull, NullBSONSchema } from "./null";

import { ArrayBSONSchema } from "./array";
import { BoolBSONSchema } from "./bool";
import { NullBSONSchema } from "./null";
import { NullableBSONSchema } from "./nullable";
import { NumberBSONSchema } from "./number";
import { ObjectBSONSchema } from "./object";
import { ObjectIdBSONSchema } from "./objectId";
import { StringBSONSchema } from "./string";

export type BSONSchema =
  | ObjectBSONSchema
  | StringBSONSchema
  | ObjectIdBSONSchema
  | NumberBSONSchema
  | BoolBSONSchema
  | ArrayBSONSchema
  | NullBSONSchema
  | NullableBSONSchema;

export type Converter<T, D> = (type: T) => D;
