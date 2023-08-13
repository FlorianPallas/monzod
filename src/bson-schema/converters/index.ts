export { object, ObjectBSONSchema } from "./object";
export { string, StringBSONSchema } from "./string";
export { objectId, ObjectIdBSONSchema } from "./objectId";

import { ObjectBSONSchema } from "./object";
import { ObjectIdBSONSchema } from "./objectId";
import { StringBSONSchema } from "./string";

export type BSONSchema =
  | ObjectBSONSchema
  | StringBSONSchema
  | ObjectIdBSONSchema;

export type Converter<T, D> = (type: T) => D;
