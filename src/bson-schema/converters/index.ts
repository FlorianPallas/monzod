export { object, ObjectBSONSchema } from "./object";
export { string, StringBSONSchema } from "./string";
export { objectId, ObjectIdBSONSchema } from "./objectId";
export { number, NumberBSONSchema } from "./number";

import { NumberBSONSchema } from "./number";
import { ObjectBSONSchema } from "./object";
import { ObjectIdBSONSchema } from "./objectId";
import { StringBSONSchema } from "./string";

export type BSONSchema =
  | ObjectBSONSchema
  | StringBSONSchema
  | ObjectIdBSONSchema
  | NumberBSONSchema;

export type Converter<T, D> = (type: T) => D;
