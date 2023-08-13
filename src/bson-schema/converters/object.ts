import { ZodObject, ZodRawShape, ZodType } from "zod";
import { BSONSchema, Converter } from ".";
import { unwrapOptional } from "../unwrap";
import { bsonSchema } from "..";

export type ObjectBSONSchema = {
  bsonType: "object";
  required?: string[];
  additionalProperties?: boolean;
  properties?: Record<string, BSONSchema>;
};

export const convertObject: Converter<ZodObject<ZodRawShape>, ObjectBSONSchema> = (
  type
) => {
  const schema: ObjectBSONSchema = {
    bsonType: "object",
    additionalProperties: type._def.unknownKeys === "passthrough",
  };

  // To get wrapper type metadata, we need to unwrap the types
  const unwrappedProperties = Object.entries(type.shape).reduce(
    (acc, [key, value]) => {
      acc[key] = unwrapOptional(value);
      return acc;
    },
    {} as Record<string, { type: ZodType; isOptional: boolean }>
  );

  schema.properties = Object.entries(unwrappedProperties).reduce(
    (acc, [name, unwrapResult]) => {
      acc[name] = bsonSchema(unwrapResult.type);
      return acc;
    },
    {} as Record<string, BSONSchema>
  );

  // From the wrapper metadata, we can find out which properties are required
  const required = Object.keys(unwrappedProperties).filter(
    (name) => !unwrappedProperties[name]?.isOptional
  );
  if (required.length > 0) schema.required = required; // The required property requires at least one item.

  // TODO: Support catchall

  return schema;
};
