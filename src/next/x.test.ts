import { assertType, describe, expect, expectTypeOf, test } from "vitest";
import { ZodArray, ZodDate, ZodObject, ZodString, z } from "zod";
import { AutoMapMeta, AutoMapType, AutoMapTypeAny, Mapper } from "./mapper";
import { arrayType, objectType, primitiveType } from "./x";

export const dateMapper = new Mapper(
  {
    mapped: z.string(),
    raw: z.date(),
  },
  {
    toMapped: (value) => value.toISOString(),
    toRaw: (value) => new Date(value),
  }
);

describe("primitive", () => {
  const date = dateMapper.raw();
  const dateString = dateMapper.mapped();

  test("toMapped", () => {
    const mappedDate = primitiveType.toMapped(date);
    const mappedDateString = primitiveType.toMapped(dateString);

    expect(mappedDate).toEqual(expect.any(ZodString));
    expect(mappedDate._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "mapped",
    });
    expectTypeOf(mappedDate).toMatchTypeOf<
      ZodString & AutoMapType<AutoMapMeta<any, any, "mapped">>
    >();

    expect(mappedDateString).toEqual(expect.any(ZodString));
    expect(mappedDateString._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "mapped",
    });
    expectTypeOf(mappedDateString).toMatchTypeOf<
      ZodString & AutoMapType<AutoMapMeta<any, any, "mapped">>
    >();
  });

  test("toRaw", () => {
    const rawDate = primitiveType.toRaw(date);
    const rawDateString = primitiveType.toRaw(dateString);

    expect(rawDate).toEqual(expect.any(ZodDate));
    expect(rawDate._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "raw",
    });
    expectTypeOf(rawDate).toMatchTypeOf<
      ZodDate & AutoMapType<AutoMapMeta<any, any, "raw">>
    >();

    expect(rawDateString).toEqual(expect.any(ZodDate));
    expect(rawDateString._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "raw",
    });
    expectTypeOf(rawDateString).toMatchTypeOf<
      ZodDate & AutoMapType<AutoMapMeta<any, any, "raw">>
    >();
  });
});

describe("object", () => {
  const user = z.object({
    id: z.string(),
    name: z.string(),
    date: dateMapper.raw(),
    nested: z.object({
      id: z.string(),
      name: z.string(),
      date: dateMapper.mapped(),
    }),
  });

  test("toMapped", () => {
    const mappedUser = objectType.toMapped(user);

    expect(mappedUser.shape).toEqual({
      id: expect.any(ZodString),
      name: expect.any(ZodString),
      date: expect.any(ZodString),
      nested: expect.any(Object),
    });
    expect(mappedUser.shape.date._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "mapped",
    });
    expect(mappedUser.shape.nested.shape).toEqual({
      id: expect.any(ZodString),
      name: expect.any(ZodString),
      date: expect.any(ZodString),
    });
    expect(mappedUser.shape.nested.shape.date._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "mapped",
    });

    assertType<{
      id: ZodString;
      name: ZodString;
      date: ZodString & AutoMapType<AutoMapMeta<any, any, "mapped">>;
    }>(mappedUser.shape);
    assertType<{
      id: ZodString;
      name: ZodString;
      date: ZodString & AutoMapType<AutoMapMeta<any, any, "mapped">>;
    }>(mappedUser.shape.nested.shape);
  });

  test("toRaw", () => {
    const mappedUser = objectType.toRaw(user);

    expect(mappedUser.shape).toEqual({
      id: expect.any(ZodString),
      name: expect.any(ZodString),
      date: expect.any(ZodDate),
      nested: expect.any(Object),
    });
    expect(mappedUser.shape.date._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "raw",
    });
    expect(mappedUser.shape.nested.shape).toEqual({
      id: expect.any(ZodString),
      name: expect.any(ZodString),
      date: expect.any(ZodDate),
    });
    expect(mappedUser.shape.nested.shape.date._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "raw",
    });

    assertType<{
      id: ZodString;
      name: ZodString;
      date: ZodDate & AutoMapType<AutoMapMeta<any, any, "raw">>;
    }>(mappedUser.shape);
    assertType<{
      id: ZodString;
      name: ZodString;
      date: ZodDate & AutoMapType<AutoMapMeta<any, any, "raw">>;
    }>(mappedUser.shape.nested.shape);
  });
});

describe("array", () => {
  const dates = z.array(dateMapper.raw());
  const dateStrings = z.array(dateMapper.mapped());

  test("toMapped", () => {
    const mappedDates = arrayType.toMapped(dates);
    const mappedDateStrings = arrayType.toMapped(dateStrings);

    expect(mappedDates).toEqual(expect.any(ZodArray));
    expect(mappedDates.element).toEqual(expect.any(ZodString));
    expect(mappedDates.element._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "mapped",
    });
    expectTypeOf(mappedDates).toMatchTypeOf<
      ZodArray<ZodString & AutoMapType<AutoMapMeta<any, any, "mapped">>>
    >();

    expect(mappedDateStrings).toEqual(expect.any(ZodArray));
    expect(mappedDateStrings.element).toEqual(expect.any(ZodString));
    expect(mappedDateStrings.element._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "mapped",
    });
    expectTypeOf(mappedDateStrings).toMatchTypeOf<
      ZodArray<ZodString & AutoMapType<AutoMapMeta<any, any, "mapped">>>
    >();
  });

  test("toRaw", () => {
    const rawDates = arrayType.toRaw(dates);
    const rawDateStrings = arrayType.toRaw(dateStrings);

    expect(rawDates).toEqual(expect.any(ZodArray));
    expect(rawDates.element).toEqual(expect.any(ZodDate));
    expect(rawDates.element._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "raw",
    });
    expectTypeOf(rawDates).toMatchTypeOf<
      ZodArray<ZodDate & AutoMapType<AutoMapMeta<any, any, "raw">>>
    >();

    expect(rawDateStrings).toEqual(expect.any(ZodArray));
    expect(rawDateStrings.element).toEqual(expect.any(ZodDate));
    expect(rawDateStrings.element._def.autoMap).toEqual({
      mapper: dateMapper,
      state: "raw",
    });
    expectTypeOf(rawDateStrings).toMatchTypeOf<
      ZodArray<ZodDate & AutoMapType<AutoMapMeta<any, any, "raw">>>
    >();
  });
});
