import { describe, expect, test } from "vitest";
import { z } from "zod";
import { convertBool } from ".";

describe("zod boolean converter", () => {
  test("bool", () => {
    const schema = z.boolean();
    const bsonSchema = convertBool(schema);
    expect(bsonSchema).toEqual({ bsonType: "bool" });
  });
});
