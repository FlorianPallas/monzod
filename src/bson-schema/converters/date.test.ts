import { describe, expect, test } from "vitest";
import { z } from "zod";
import { convertDate } from ".";
import { dateTimeRegex } from "./date";

describe("zod date converter", () => {
  test("date", () => {
    const schema = z.date();
    const bsonSchema = convertDate(schema);
    expect(bsonSchema).toEqual({
      bsonType: "string",
      minLength: 24,
      maxLength: 27,
      pattern: dateTimeRegex.source,
    });
  });

  test("throws for min check", () => {
    const schema = z.date().min(new Date());
    expect(() => convertDate(schema)).toThrow();
  });

  test("throws for max check", () => {
    const schema = z.date().max(new Date());
    expect(() => convertDate(schema)).toThrow();
  });
});
