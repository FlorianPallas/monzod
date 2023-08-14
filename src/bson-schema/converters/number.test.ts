import { describe, expect, test } from "vitest";
import { z } from "zod";
import { convertNumber } from ".";

describe("zod number converter", () => {
  test("int", () => {
    const schema = z.number().int();
    const bsonSchema = convertNumber(schema);
    expect(bsonSchema.bsonType).toBe("long");
  });

  test("min", () => {
    const schema = z.number().min(5);
    const bsonSchema = convertNumber(schema);
    expect(bsonSchema.minimum).toBe(5);
    expect(bsonSchema.exclusiveMinimum).toBe(false);
  });

  test("max", () => {
    const schema = z.number().max(5);
    const bsonSchema = convertNumber(schema);
    expect(bsonSchema.maximum).toBe(5);
    expect(bsonSchema.exclusiveMaximum).toBe(false);
  });

  test("finite", () => {
    const schema = z.number().finite();
    const bsonSchema = convertNumber(schema);
    expect(bsonSchema.minimum).toBe(Number.POSITIVE_INFINITY);
    expect(bsonSchema.exclusiveMinimum).toBe(true);
    expect(bsonSchema.maximum).toBe(Number.POSITIVE_INFINITY);
    expect(bsonSchema.exclusiveMaximum).toBe(true);
  });

  test("finite with min", () => {
    const schema = z.number().finite().min(5);
    const bsonSchema = convertNumber(schema);
    expect(bsonSchema.minimum).toBe(5);
    expect(bsonSchema.exclusiveMinimum).toBe(false);
    expect(bsonSchema.maximum).toBe(Number.POSITIVE_INFINITY);
    expect(bsonSchema.exclusiveMaximum).toBe(true);
  });

  test("finite with max", () => {
    const schema = z.number().finite().max(5);
    const bsonSchema = convertNumber(schema);
    expect(bsonSchema.minimum).toBe(Number.POSITIVE_INFINITY);
    expect(bsonSchema.exclusiveMinimum).toBe(true);
    expect(bsonSchema.maximum).toBe(5);
    expect(bsonSchema.exclusiveMaximum).toBe(false);
  });

  test("multipleOf", () => {
    const schema = z.number().multipleOf(5);
    const bsonSchema = convertNumber(schema);
    expect(bsonSchema.multipleOf).toBe(5);
  });
});
