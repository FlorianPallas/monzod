import { ZodNullable, ZodType } from "zod";
import { BSONSchema, Converter } from ".";
import { bsonSchema } from "..";
import { NullBSONSchema } from "./null";

export type NullableBSONSchema = {
  oneOf: [BSONSchema, NullBSONSchema];
};

export const convertNullable: Converter<
  ZodNullable<ZodType>,
  NullableBSONSchema
> = (type) => ({
  oneOf: [bsonSchema(type.unwrap()), { bsonType: "null" }],
});
