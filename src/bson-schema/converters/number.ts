import { ZodNumber } from "zod";
import { Converter } from ".";

export type NumberBSONSchema = {
  bsonType: "number" | "int" | "long" | "double" | "decimal";
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
};

export const number: Converter<ZodNumber, NumberBSONSchema> = (type) => {
  const schema: NumberBSONSchema = {
    bsonType: "double",
  };

  for (const check of type._def.checks) {
    switch (check.kind) {
      case "int":
        schema.bsonType = "int";
        break;
      case "min":
        schema.minimum = check.value;
        schema.exclusiveMinimum = !check.inclusive;
        break;
      case "max":
        schema.maximum = check.value;
        schema.exclusiveMaximum = !check.inclusive;
        break;
      case "finite":
        if (schema.minimum === undefined) {
          schema.minimum = Number.POSITIVE_INFINITY;
          schema.exclusiveMinimum = true;
        }
        if (schema.maximum === undefined) {
          schema.maximum = Number.POSITIVE_INFINITY;
          schema.exclusiveMaximum = true;
        }
        break;
      case "multipleOf":
        schema.multipleOf = check.value;
        break;
    }
  }

  return schema;
};
