import { ZodObject, ZodRawShape } from "zod";
import { BSONSchema, Converter } from ".";
import { unwrap, UnwrapResult } from "../unwrap";

export type ObjectBSONSchema = {
  bsonType: "object";
  required?: string[];
  additionalProperties?: boolean;
  properties?: Record<string, BSONSchema>;
};

export const object: Converter<ZodObject<ZodRawShape>, ObjectBSONSchema> = (
  type
) => {
  const schema: ObjectBSONSchema = {
    bsonType: "object",
    additionalProperties: type._def.unknownKeys === "passthrough",
  };

  // To get wrapper type metadata, we need to unwrap the types
  const unwrappedProperties = Object.entries(type.shape).reduce(
    (acc, [key, value]) => {
      acc[key] = unwrap(value);
      return acc;
    },
    {} as Record<string, UnwrapResult>
  );
  schema.properties = Object.entries(unwrappedProperties).reduce(
    (acc, [name, unwrapResult]) => {
      acc[name] = unwrapResult.schema;
      return acc;
    },
    {} as Record<string, BSONSchema>
  );

  // From the wrapper metadata, we can find out which properties are required
  const required = Object.keys(unwrappedProperties).filter(
    (name) => !unwrappedProperties[name]?.modifiers.isOptional
  );
  if (required.length > 0) schema.required = required; // The required property requires at least one item.

  // TODO: Support catchall

  return schema;
};
