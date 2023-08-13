import { describe, expect, test } from "vitest";
import { z } from "zod";
import { bool } from ".";

describe("zod boolean converter", () => {
  test("bool", () => {
    const schema = z.boolean();
    const bsonSchema = bool(schema);
    expect(bsonSchema).toEqual({ bsonType: "bool" });
  });
});