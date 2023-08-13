import { ZodString } from "zod";
import { Converter } from ".";

export interface StringBSONSchema {
  bsonType: "string";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export const convertString: Converter<ZodString, StringBSONSchema> = (type) => {
  const schema: StringBSONSchema = {
    bsonType: "string",
  };

  const applyRegex = (regex: RegExp) => {
    if (schema.pattern)
      throw new Error(
        "Your schema requires multiple regex patterns to match zod functionality. This can happen if you use regex checks in addition to common checks like startsWith, endsWith or includes. If necessary, write a custom regex pattern that combines all of your requirements."
      );
    schema.pattern = regex.source;
  };

  for (const check of type._def.checks) {
    switch (check.kind) {
      // Length
      case "min":
        schema.minLength = check.value;
        break;
      case "max":
        schema.maxLength = check.value;
        break;
      case "length":
        schema.minLength = check.value;
        schema.maxLength = check.value;
        break;

      // Static regex patterns
      case "email":
        applyRegex(emailRegex);
        break;
      case "url":
        applyRegex(urlRegex);
        break;
      case "emoji":
        applyRegex(emojiRegex);
        break;
      case "uuid":
        applyRegex(uuidRegex);
        break;
      case "cuid":
        applyRegex(cuidRegex);
        break;
      case "cuid2":
        applyRegex(cuid2Regex);
        break;
      case "ulid":
        applyRegex(ulidRegex);
        break;
      case "datetime":
        applyRegex(
          datetimeRegex({
            precision: check.precision,
            offset: check.offset,
          })
        );
        break;
      case "ip":
        switch (check.version) {
          case undefined:
            applyRegex(ipRegex);
            break;
          case "v4":
            applyRegex(ipv4Regex);
            break;
          case "v6":
            applyRegex(ipv6Regex);
            break;
        }
        break;

      // Dynamic regex patterns
      case "regex":
        applyRegex(check.regex);
        break;
      case "includes":
        applyRegex(new RegExp(check.value));
        break;
      case "startsWith":
        applyRegex(new RegExp(`^${check.value}`));
        break;
      case "endsWith":
        applyRegex(new RegExp(`${check.value}$`));
        break;

      // Transformations
      case "trim":
      case "toLowerCase":
      case "toUpperCase":
        throw new Error(
          "Your schema uses string transformations like trim, toLowerCase or toUpperCase. These dynamically change the string and cannot be converted to a BSON schema. Please remove these checks from your schema. If necessary, apply these transformations in your application code."
        );
    }
  }

  return schema;
};

// from https://github.com/colinhacks/zod/blob/master/src/types.ts (zod@3.21.4)
export const cuidRegex = /^c[^\s-]{8,}$/i;
export const cuid2Regex = /^[a-z][a-z0-9]*$/;
export const ulidRegex = /[0-9A-HJKMNP-TV-Z]{26}/;
export const uuidRegex =
  /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
export const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
export const ipv4Regex =
  /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
export const ipv6Regex =
  /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
export const datetimeRegex = (args: {
  precision: number | null;
  offset: boolean;
}) => {
  if (args.precision) {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`
      );
    } else {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`
      );
    }
  } else if (args.precision === 0) {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`
      );
    } else {
      return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
    }
  } else {
    if (args.offset) {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`
      );
    } else {
      return new RegExp(
        `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`
      );
    }
  }
};

// from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
export const urlRegex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

// combine ipv4 and ipv6 regex
export const ipRegex = new RegExp(`${ipv4Regex.source}|${ipv6Regex.source}`);
