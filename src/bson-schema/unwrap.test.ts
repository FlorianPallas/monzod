import { describe, expect, test } from "vitest";
import { unwrapNullable, unwrapOptional } from "./unwrap";
import { ZodFirstPartyTypeKind, ZodType, ZodTypeAny, z } from "zod";
import { getZodKind } from "../types";

describe("unwrapOptional", () => {
  test("unwraps optional", () => {
    const result = unwrapOptional(z.string().optional());
    expect(result.isOptional).toBeTruthy();
    expect(getZodKind(result.type)).toBe(ZodFirstPartyTypeKind.ZodString);
  });

  test("does not affect other types", () => {
    const schema = z.string();
    const result = unwrapOptional(schema);
    expect(result.isOptional).toBeFalsy();
    expect(result.type).toBe(schema);
  });
});

describe("unwrapNullable", () => {
  test("unwraps nullable", () => {
    const result = unwrapNullable(z.string().nullable());
    expect(result.isNullable).toBeTruthy();
    expect(getZodKind(result.type)).toBe(ZodFirstPartyTypeKind.ZodString);
  });

  test("does not affect other types", () => {
    const schema = z.string();
    const result = unwrapNullable(schema);
    expect(result.isNullable).toBeFalsy();
    expect(result.type).toBe(schema);
  });
});
