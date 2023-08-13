import { describe, expect, test } from "vitest";
import { z } from "zod";
import { convertEnum } from ".";

describe("zod enum converter", () => {
  test("enum", () => {
    const schema = z.enum(["a", "b", "c"]);
    const bsonSchema = convertEnum(schema);
    expect(bsonSchema).toEqual({
      bsonType: "string",
      enum: ["a", "b", "c"],
    });
  });
});
