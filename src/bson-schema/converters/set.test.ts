import { describe, expect, test } from "vitest";
import { z } from "zod";
import { set } from ".";

describe("zod array converter", () => {
  test("set", () => {
    const schema = z.set(z.string());
    const bsonSchema = set(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
      uniqueItems: true,
    });
  });

  test("min length", () => {
    const schema = z.set(z.string()).min(1);
    const bsonSchema = set(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
      minItems: 1,
      uniqueItems: true,
    });
  });

  test("max length", () => {
    const schema = z.set(z.string()).max(1);
    const bsonSchema = set(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
      maxItems: 1,
      uniqueItems: true,
    });
  });

  test("size", () => {
    const schema = z.set(z.string()).size(1);
    const bsonSchema = set(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
      minItems: 1,
      maxItems: 1,
      uniqueItems: true,
    });
  });
});
