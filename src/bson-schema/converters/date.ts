import { ZodDate } from "zod";
import { Converter } from ".";

export type DateBSONSchema = {
  bsonType: "date";
};

export const convertDate: Converter<ZodDate, DateBSONSchema> = (type) => {
  const schema: DateBSONSchema = {
    bsonType: "date",
  };

  for (const check of type._def.checks) {
    switch (check.kind) {
      case "min":
      case "max":
        throw new Error(
          "Your schema includes date range checks. As dates are stringified by mongodb, it is not possible to include min and max dates in the validation schema."
        );
    }
  }

  return schema;
};
