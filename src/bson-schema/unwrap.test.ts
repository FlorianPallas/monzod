import { describe, expect, test } from "vitest";
import { unwrap } from "./unwrap";
import { z } from "zod";

describe("unwrap", () => {
  test("unwraps optional", () => {
    expect(unwrap(z.string().optional())).toEqual({
      schema: { bsonType: "string" },
      modifiers: { isOptional: true },
    });
  });
});
