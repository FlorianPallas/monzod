import { describe, expect, test } from "vitest";
import { z } from "zod";
import { array } from ".";

describe("zod array converter", () => {
  test("array", () => {
    const schema = z.array(z.string());
    const bsonSchema = array(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
    });
  });

  test("min length", () => {
    const schema = z.array(z.string()).min(1);
    const bsonSchema = array(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
      minItems: 1,
    });
  });

  test("max length", () => {
    const schema = z.array(z.string()).max(1);
    const bsonSchema = array(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
      maxItems: 1,
    });
  });

  test("exact length", () => {
    const schema = z.array(z.string()).length(1);
    const bsonSchema = array(schema);
    expect(bsonSchema).toEqual({
      bsonType: "array",
      items: { bsonType: "string" },
      minItems: 1,
      maxItems: 1,
    });
  });
});
