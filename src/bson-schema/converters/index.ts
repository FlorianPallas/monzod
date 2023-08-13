export { object, ObjectBSONSchema } from "./object";
export { string, StringBSONSchema } from "./string";
export { objectId, ObjectIdBSONSchema } from "./objectId";
export { number, NumberBSONSchema } from "./number";
export { bool, BoolBSONSchema } from "./bool";
export { array, ArrayBSONSchema } from "./array";
export { tuple } from "./tuple";
export { set } from "./set";

import { ArrayBSONSchema } from "./array";
import { BoolBSONSchema } from "./bool";
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
  | ArrayBSONSchema;

export type Converter<T, D> = (type: T) => D;
