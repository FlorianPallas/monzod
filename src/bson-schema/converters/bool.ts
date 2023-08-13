import { ZodBoolean } from "zod";
import { Converter } from ".";

export type BoolBSONSchema = { bsonType: "bool" };

export const bool: Converter<ZodBoolean, BoolBSONSchema> = (type) => ({
  bsonType: "bool",
});
