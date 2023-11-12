import { describe, expect, expectTypeOf, test } from "vitest";
import { z } from "zod";
import { mapKey, mapObject, mapSchema, mapType, mapValue } from "./mapping";
import { objectId, objectIdString } from "./mapper";

const user = z.object({
  _id: objectId(),
  name: z.string(),
  age: z.number(),
});

describe("type mapping", () => {
  expect(mapType(objectId(), "mapped")).toStrictEqual(objectIdString());
});

// describe("value mapping", () => {});

describe("key mapping", () => {
  const _id = mapsTo(z.number(), {
    type: z.string(),
    value: (value) => value.toString(),
    key: "id",
  });

  const date = mapsTo(z.date(), {
    type: z.string(),
    value: (value) => value.toISOString(),
  });

  test("with key", () => {
    expect(mapKey(_id, "_id")).toEqual("id");
    expectTypeOf(mapKey(_id, "_id")).toEqualTypeOf<"id">();
  });

  test("without key", () => {
    expect(mapKey(date, "date")).toEqual("date");
    expectTypeOf(mapKey(date, "date")).toEqualTypeOf<"date">();
  });
});

describe("maps to", () => {
  test("type and value", () => {
    const _id = mapsTo(z.number(), {
      type: z.string(),
      value: (value) => value.toString(),
      key: "id",
    });

    expect(_id._def.mapping).toEqual({
      type: expect.any(z.ZodString),
      value: expect.any(Function),
      key: "id",
    });
    expectTypeOf(_id._def.mapping).toEqualTypeOf<
      Mapping<z.ZodNumber, z.ZodString, "id">
    >();
  });

  test("without key", () => {
    const date = mapsTo(z.date(), {
      type: z.string(),
      value: (value) => value.toISOString(),
    });

    expect(date._def.mapping).toEqual({
      type: expect.any(z.ZodString),
      value: expect.any(Function),
    });
    expectTypeOf(date._def.mapping).toEqualTypeOf<
      Mapping<z.ZodDate, z.ZodString, undefined>
    >();
  });
});

test("map type", () => {
  expect(mapType(id)._def).toEqual(z.string()._def);
  expectTypeOf(mapType(id)).toEqualTypeOf<z.ZodString>();
});

test("map value", () => {
  expect(mapValue(id, 1234)).toEqual("1234");
  expectTypeOf(mapValue(id, 1234)).toEqualTypeOf<string>();
});

test("map key", () => {
  expect(mapKey(id, "_id")).toEqual("id");
  expectTypeOf(mapKey(id, "_id")).toEqualTypeOf<"id">();
});

test("map schema", () => {
  expect(mapSchema(user).shape).toEqual({
    id: mappedId,
    name: user.shape.name,
    age: user.shape.age,
  });
  expectTypeOf(mapSchema(user).shape).toEqualTypeOf<{
    id: typeof mappedId;
    name: typeof user.shape.name;
    age: typeof user.shape.age;
  }>();
});

test("map object", () => {
  expect(
    mapObject(user, {
      _id: 1234,
      name: "John",
      age: 42,
    })
  ).toEqual({
    id: "1234",
    name: "John",
    age: 42,
  });
  expectTypeOf(
    mapObject(user, {
      _id: 1234,
      name: "John",
      age: 42,
    })
  ).toEqualTypeOf<{
    id: string;
    name: string;
    age: number;
  }>();
});

describe("nested", () => {
  const mappedId = z.string();

  const address = z.object({
    _id: mapsTo(z.number(), {
      type: mappedId,
      value: (value) => value.toString(),
      key: "id",
    }),
    street: z.string(),
  });

  const user = z.object({
    _id: mapsTo(z.number(), {
      type: mappedId,
      value: (value) => value.toString(),
      key: "id",
    }),
    name: z.string(),
    age: z.number(),
    address,
  });

  test("map nested schema", () => {
    const mappedSchema = mapSchema(user);

    expect(mappedSchema.shape).toEqual({
      id: mappedId,
      name: user.shape.name,
      age: user.shape.age,
      address: expect.any(z.ZodObject),
    });

    expect(mappedSchema.shape.address.shape).toEqual({
      id: mappedId,
      street: address.shape.street,
    });

    expectTypeOf(mappedSchema.shape).toEqualTypeOf<{
      id: typeof mappedId;
      name: typeof user.shape.name;
      age: typeof user.shape.age;
      address: z.ZodObject<{
        id: typeof mappedId;
        street: typeof address.shape.street;
      }>;
    }>();
  });

  test("map nested object", () => {
    const mappedObject = mapObject(user, {
      _id: 1234,
      address: {
        _id: 5678,
        street: "Main Street",
      },
      age: 42,
      name: "John",
    });

    expect(mappedObject).toEqual({
      id: "1234",
      address: {
        id: "5678",
        street: "Main Street",
      },
      age: 42,
      name: "John",
    });

    expectTypeOf(mappedObject).toEqualTypeOf<{
      id: string;
      address: {
        id: string;
        street: string;
      };
      age: number;
      name: string;
    }>();
  });
});
