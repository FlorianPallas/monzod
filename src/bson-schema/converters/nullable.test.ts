import { describe, expect, test } from "vitest";
import { z } from "zod";
import { convertNullable } from ".";

describe("zod nullable converter", () => {
  test("nullable", () => {
    const schema = z.string().nullable();
    const bsonSchema = convertNullable(schema);
    expect(bsonSchema).toEqual({
      oneOf: [{ bsonType: "string" }, { bsonType: "null" }],
    });
  });
});
