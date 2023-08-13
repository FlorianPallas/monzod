import { describe, expect, test } from "vitest";
import { z } from "zod";
import { object } from ".";

describe("zod object converter", () => {
  test("object", () => {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
    });
    const bsonSchema = object(schema);
    expect(bsonSchema).toEqual({
      bsonType: "object",
      required: ["firstName", "lastName"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
      },
      additionalProperties: false,
    });
  });

  test("object with optional properties", () => {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string().optional(),
    });
    const bsonSchema = object(schema);
    expect(bsonSchema).toEqual({
      bsonType: "object",
      required: ["firstName"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
      },
      additionalProperties: false,
    });
  });

  test("partial", () => {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
    }).partial();
    const bsonSchema = object(schema);
    expect(bsonSchema).toEqual({
      bsonType: "object",
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
      },
      additionalProperties: false,
    });
  });

  test("passthrough", () => {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
    }).passthrough();
    const bsonSchema = object(schema);
    expect(bsonSchema).toEqual({
      bsonType: "object",
      required: ["firstName", "lastName"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
      },
      additionalProperties: true,
    });
  });
});
