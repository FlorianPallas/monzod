import { ZodDate, z } from "zod";
import { Converter, StringBSONSchema } from ".";

export const convertDate: Converter<ZodDate, StringBSONSchema> = (type) => {
  const schema: StringBSONSchema = {
    bsonType: "string",
    // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
    minLength: 24,
    maxLength: 27,
    pattern: dateTimeRegex.source,
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

// from https://gist.github.com/ppo/17bb97d14343d47efaf4
export const dateTimeRegex =
  /(^\d{4}(-\d{2}){0,2})?((^|T)\d{2}(:\d{2}(:\d{2}(\.\d+)?)?)?(Z|[\+|-]\d{2}:\d{2})?)?$/;
