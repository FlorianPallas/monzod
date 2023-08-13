import { ZodTuple, ZodTypeAny } from "zod";
import { ArrayBSONSchema, Converter } from ".";
import { bsonSchema } from "..";

export const convertTuple: Converter<
  ZodTuple<[] | [ZodTypeAny, ...ZodTypeAny[]]>,
  ArrayBSONSchema
> = (type) => ({
  bsonType: "array",
  items: type.items.map(bsonSchema),
  additionalItems: false,
  minItems: type.items.length,
  maxItems: type.items.length,
});
