import { describe, expect, test } from "vitest";
import { z } from "zod";
import { tuple } from ".";

describe("zod array converter", () => {
  test("tuple", () => {
    const schema = z.tuple([z.string(), z.number()]);
    const bsonSchema = tuple(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: [{ bsonType: "string" }, { bsonType: "double" }],
      minItems: 2,
      maxItems: 2,
      additionalItems: false,
    });
  });

  test("empty tuple", () => {
    const schema = z.tuple([]);
    const bsonSchema = tuple(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: [],
      minItems: 0,
      maxItems: 0,
      additionalItems: false,
    });
  });
});
