import { ZodBoolean } from "zod";
import { Converter } from ".";

export type BoolBSONSchema = { bsonType: "bool" };

export const convertBool: Converter<ZodBoolean, BoolBSONSchema> = (type) => ({
  bsonType: "bool",
});
