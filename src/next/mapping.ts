import { z } from "zod";
import { AutoMapMeta } from "./mapper";

export const mapType = <T extends AutoMapMeta, S extends "raw" | "mapped">(
  metadata: T,
  newState: S
): MapType<T, S> => {
  const { serializer, serialization } = metadata;

  if (newState === "raw") {
    if (serialization === "mapped") return serializer.rawType() as any;
    return metadata as any;
  }

  if (newState === "mapped") {
    if (serialization === "raw") return serializer.mappedType() as any;
    return metadata as any;
  }

  throw new Error("Invalid serialization state");
};

export const mapValue = <T extends AutoMapMeta, S extends "raw" | "mapped">(
  metadata: T,
  value: z.infer<MappedType<T>> | z.infer<RawType<T>>,
  newState: S
): MapValue<T, S> => {
  const { serializer, serialization } = metadata;

  if (newState === "raw") {
    if (serialization === "mapped") return serializer.rawValue(value);
    return value;
  }

  if (newState === "mapped") {
    if (serialization === "raw") return serializer.mappedValue(value);
    return value;
  }

  throw new Error("Invalid serialization state");
};

export type SerializerType<T extends AutoMapMeta> = { _def: T };

type SerializerState = "raw" | "mapped";

type MappedType<T extends AutoMapMeta> = ReturnType<
  T["serializer"]["mappedType"]
>;
type RawType<T extends AutoMapMeta> = ReturnType<T["serializer"]["rawType"]>;

export type MapValue<
  T extends AutoMapMeta,
  S extends "raw" | "mapped",
> = S extends "raw" ? z.infer<RawType<T>> : z.infer<MappedType<T>>;

export type MapType<
  T extends AutoMapMeta,
  S extends "raw" | "mapped",
> = S extends "raw" ? MappedType<T> : RawType<T>;

export type MapSchema<
  T extends z.ZodObject<z.ZodRawShape>,
  S extends SerializerState,
> = z.ZodObject<{
  [K in keyof T["shape"] as MapKey<
    T["shape"][K],
    K
  >]: T["shape"][K] extends SerializerType<infer M>
    ? MapType<M, S>
    : T["shape"][K];
}>;

export const mapSchema = <
  T extends z.ZodObject<z.ZodRawShape>,
  S extends "raw" | "mapped",
>(
  schema: T,
  newState: S
): MapSchema<T, S> => {
  const newShape = Object.entries(schema.shape).reduce(
    (acc, [key, type]) => {
      // handle nested objects
      if (type._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
        const objectType = type as z.ZodObject<z.ZodRawShape>;
        const nestedObject = mapSchema(objectType, newState);
        return { ...acc, [key]: nestedObject };
      }

      // handle primitives
      const hasMapping = type._def.serializer !== undefined;
      if (!hasMapping) return { ...acc, [key]: type };
      return { ...acc, [key]: mapType(type, newState) };
    },
    {} as MapSchema<T, S>["shape"]
  );
  return z.object(newShape);
};

export type MapObject<
  T extends z.ZodObject<z.ZodRawShape>,
  S extends "raw" | "mapped",
> = z.infer<MapSchema<T, S>>;

export const mapObject = <
  T extends z.ZodObject<z.ZodRawShape>,
  S extends "raw" | "mapped",
>(
  schema: T,
  object: z.infer<T>,
  newState: S
): MapObject<T, S> => {
  const newObject = Object.entries(schema.shape).reduce(
    (acc, [key, type]) => {
      // handle objects
      if (type._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
        const objectType = type as z.ZodObject<z.ZodRawShape>;
        const nestedObject = mapObject(objectType, object[key], newState);
        return { ...acc, [key]: nestedObject };
      }

      // handle primitives
      const hasMapping = type._def.mapping !== undefined;
      if (!hasMapping) return { ...acc, [key]: object[key] };
      return {
        ...acc,
        [mapKey(type, key)]: mapValue(type, object[key], newState),
      };
    },
    {} as MapObject<T, S>
  );
  return newObject;
};
