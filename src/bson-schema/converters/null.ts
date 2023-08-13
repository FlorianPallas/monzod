import { ZodNull } from "zod";
import { Converter } from ".";

export type NullBSONSchema = {
  bsonType: "null";
};

export const convertNull: Converter<ZodNull, NullBSONSchema> = () => ({
  bsonType: "null",
});
