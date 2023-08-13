import { ZodArray, ZodBoolean, ZodType } from "zod";
import { BSONSchema, Converter } from ".";
import { bsonSchema } from "..";

export type ArrayBSONSchema = {
  bsonType: "array";
  items?: BSONSchema | BSONSchema[];
  additionalItems?: boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
};

export const convertArray: Converter<ZodArray<ZodType>, ArrayBSONSchema> = (type) => ({
  bsonType: "array",
  items: bsonSchema(type.element),
  minItems: type._def.exactLength?.value ?? type._def.minLength?.value,
  maxItems: type._def.exactLength?.value ?? type._def.maxLength?.value,
});
