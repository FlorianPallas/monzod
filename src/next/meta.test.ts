import { assertType, expect, expectTypeOf, test } from "vitest";
import { meta } from "./meta";
import { z } from "zod";

test("metadata", () => {
  const foo = meta(z.string(), { foo: "bar" });
  expect(foo._def.foo).toEqual("bar");
  expectTypeOf(foo).toEqualTypeOf<
    z.ZodString & { _def: z.ZodStringDef & { foo: string } }
  >();
});
