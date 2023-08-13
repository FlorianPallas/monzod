import { ZodSet } from "zod";
import { ArrayBSONSchema, Converter } from ".";
import { bsonSchema } from "..";

export const convertSet: Converter<ZodSet, ArrayBSONSchema> = (type) => ({
  bsonType: "array",
  items: bsonSchema(type._def.valueType),
  minItems: type._def.minSize?.value,
  maxItems: type._def.maxSize?.value,
  uniqueItems: true,
});
