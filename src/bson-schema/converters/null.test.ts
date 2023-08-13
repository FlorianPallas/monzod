import { describe, expect, test } from "vitest";
import { z } from "zod";
import { convertNull } from ".";

describe("zod null converter", () => {
  test("nullable", () => {
    const schema = z.null();
    const bsonSchema = convertNull(schema);
    expect(bsonSchema).toEqual({ bsonType: "null" });
  });
});
