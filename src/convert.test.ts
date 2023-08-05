import { z } from "zod";
import { ObjectId } from "mongodb";
import {
  mapEntity,
  mapKey,
  mapSchema,
  mapShape,
  mapType,
  mapValue,
} from "./convert";
import { id, idString } from "./types";

describe("key mapping", () => {
  test("_id should be mapped to id", () => {
    expect(mapKey("_id")).toBe("id");
  });

  test("other keys should not be changed", () => {
    expect(mapKey("id")).toBe("id");
    expect(mapKey("name")).toBe("name");
    expect(mapKey("groupId")).toBe("groupId");
    expect(mapKey("")).toBe("");
    expect(mapKey("_name")).toBe("_name");
  });
});

describe("value mapping", () => {
  test("id should be mapped to string", () => {
    const hex = "507f191e810c19729de860ea";
    expect(mapValue(new ObjectId(hex))).toBe(hex);
  });

  test("other values should not be changed", () => {
    expect(mapValue("id")).toBe("id");
    expect(mapValue(1)).toBe(1);
    expect(mapValue(true)).toBe(true);
    expect(mapValue(false)).toBe(false);
    expect(mapValue(null)).toBe(null);
    expect(mapValue(undefined)).toBe(undefined);
    expect(mapValue({})).toEqual({});
  });
});

describe("type mapping", () => {
  test("id should be mapped to string", () => {
    expect((mapType(id()) as any)._def.typeName).toBe(z.string()._def.typeName);
  });

  test("other types should not be changed", () => {
    expect((mapType(z.string()) as any)._def.typeName).toBe(
      z.string()._def.typeName
    );
    expect((mapType(z.number()) as any)._def.typeName).toBe(
      z.number()._def.typeName
    );
    expect((mapType(z.boolean()) as any)._def.typeName).toBe(
      z.boolean()._def.typeName
    );
    expect((mapType(z.null()) as any)._def.typeName).toBe(
      z.null()._def.typeName
    );
    // TODO: fix these cases
    // expect((mapType(z.undefined()) as any)._def.typeName).toBe(
    //   z.undefined()._def.typeName
    // );
    // expect((mapType(z.object({})) as any)._def.typeName).toBe(
    //   z.object({})._def.typeName
    // );
    expect((mapType(z.array(z.string())) as any)._def.typeName).toBe(
      z.array(z.string())._def.typeName
    );
  });
});

describe("shape mapping", () => {
  test("_id should be mapped to id", () => {
    const shape = {
      _id: id(),
      name: z.string(),
      groupId: id(),
    };

    expect((mapShape(shape) as any).id._def.typeName).toBe(
      z.string()._def.typeName
    );
    expect((mapShape(shape) as any).groupId._def.typeName).toBe(
      z.string()._def.typeName
    );
    expect(mapShape(shape).name).toBe(shape.name);
  });

  test("other types should not be changed", () => {
    const shape = {
      name: z.string(),
      email: z.string(),
      salary: z.number(),
      isManager: z.boolean(),
    };

    Object.entries(shape).forEach(([key, value]) => {
      expect((mapShape(shape) as any)[key]).toBe(value);
    });
  });
});

describe("object mapping", () => {
  test("should map", () => {
    const entity = z.object({
      _id: id(),
      name: z.string(),
      groupId: id(),
    });

    expect(mapSchema(entity).shape.id._def.typeName).toEqual(
      idString()._def.typeName
    );
    expect(mapSchema(entity).shape.name._def.typeName).toEqual(
      z.string()._def.typeName
    );
    expect(mapSchema(entity).shape.groupId._def.typeName).toEqual(
      idString()._def.typeName
    );
  });
});

describe("entity mapping", () => {
  test("should map", () => {
    const entity = {
      _id: new ObjectId(),
      name: "John",
      groupId: new ObjectId(),
    };

    expect(mapEntity(entity)).toEqual({
      id: entity._id.toHexString(),
      name: entity.name,
      groupId: entity.groupId.toHexString(),
    });
  });
});
