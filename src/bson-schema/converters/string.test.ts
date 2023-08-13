import { describe, expect, test } from "vitest";
import { z } from "zod";
import { convertString } from ".";
import {
  cuid2Regex,
  cuidRegex,
  datetimeRegex,
  emailRegex,
  emojiRegex,
  ipRegex,
  ipv4Regex,
  ipv6Regex,
  ulidRegex,
  urlRegex,
  uuidRegex,
} from "./string";

describe("zod string converter", () => {
  // Length
  test("min length", () => {
    const schema = z.string().min(5);
    const bsonSchema = convertString(schema);
    expect(bsonSchema.minLength).toBe(5);
  });

  test("max length", () => {
    const schema = z.string().max(10);
    const bsonSchema = convertString(schema);
    expect(bsonSchema.maxLength).toBe(10);
  });

  test("exact length", () => {
    const schema = z.string().length(7);
    const bsonSchema = convertString(schema);
    expect(bsonSchema.minLength).toBe(7);
    expect(bsonSchema.maxLength).toBe(7);
  });

  // Static regex patterns
  test("email", () => {
    const schema = z.string().email();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(emailRegex.source);
  });

  test("url", () => {
    const schema = z.string().url();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(urlRegex.source);
  });

  test("emoji", () => {
    const schema = z.string().emoji();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(emojiRegex.source);
  });

  test("uuid", () => {
    const schema = z.string().uuid();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(uuidRegex.source);
  });

  test("cuid", () => {
    const schema = z.string().cuid();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(cuidRegex.source);
  });

  test("cuid2", () => {
    const schema = z.string().cuid2();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(cuid2Regex.source);
  });

  test("cuid2", () => {
    const schema = z.string().cuid2();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(cuid2Regex.source);
  });

  test("ulid", () => {
    const schema = z.string().ulid();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(ulidRegex.source);
  });

  test("datetime", () => {
    const schema = z.string().datetime();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(
      datetimeRegex({ precision: null, offset: false }).source
    );
  });

  test("ip", () => {
    const schema = z.string().ip();
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(ipRegex.source);
  });

  test("ipv4", () => {
    const schema = z.string().ip({ version: "v4" });
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(ipv4Regex.source);
  });

  test("ipv6", () => {
    const schema = z.string().ip({ version: "v6" });
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(ipv6Regex.source);
  });

  // Dynamic regex patterns
  test("custom regex", () => {
    const customRegex = /here be dragons/;
    const schema = z.string().regex(customRegex);
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe(customRegex.source);
  });

  test("starts with", () => {
    const schema = z.string().startsWith("hello");
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe("^hello");
  });

  test("ends with", () => {
    const schema = z.string().endsWith("world");
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe("world$");
  });

  // Transformations
  test("includes", () => {
    const schema = z.string().includes("dragons");
    const bsonSchema = convertString(schema);
    expect(bsonSchema.pattern).toBe("dragons");
  });

  test("trim", () => {
    const schema = z.string().trim();
    expect(() => convertString(schema)).toThrow();
  });

  test("toLowerCase", () => {
    const schema = z.string().toLowerCase();
    expect(() => convertString(schema)).toThrow();
  });

  test("toUpperCase", () => {
    const schema = z.string().toUpperCase();
    expect(() => convertString(schema)).toThrow();
  });

  // Miscellaneous
  test("throws for multiple regex patterns", () => {
    const schema = z.string().regex(/a/).startsWith("b");
    expect(() => convertString(schema)).toThrow();
  });

  test("throws for transformations", () => {
    const schema = z.string().toLowerCase();
    expect(() => convertString(schema)).toThrow();
  });
});
