import { ZodEnum } from "zod";
import { Converter } from ".";

export type EnumBSONSchema = {
  bsonType: string;
  enum: string[];
};

export const convertEnum: Converter<
  ZodEnum<[string, ...string[]]>,
  EnumBSONSchema
> = (type) => ({
  bsonType: "string",
  enum: type.options,
});
