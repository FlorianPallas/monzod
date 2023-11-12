import { z } from "zod";
import {
  AutoMapMeta,
  AutoMapMetaAny,
  AutoMapType,
  AutoMapTypeAny,
} from "./mapper";

// UTILS

type MappedType<T extends AutoMapMeta> = ReturnType<T["mapper"]["mapped"]>;
type RawType<T extends AutoMapMeta> = ReturnType<T["mapper"]["raw"]>;

export const getAutoMap = <T extends AutoMapType<AutoMapMetaAny>>(type: T) =>
  type._def.autoMap as T["_def"]["autoMap"];

// ANY

type AnyToRaw<T> = T extends z.SomeZodObject
  ? ObjectToRaw<T>
  : T extends z.ZodArray<z.ZodTypeAny>
  ? ArrayToRaw<T>
  : T extends AutoMapTypeAny
  ? PrimitiveToRaw<T>
  : T;

type AnyToMapped<T> = T extends z.SomeZodObject
  ? ObjectToMapped<T>
  : T extends z.ZodArray<z.ZodTypeAny>
  ? ArrayToMapped<T>
  : T extends AutoMapTypeAny
  ? PrimitiveToMapped<T>
  : T;

export const any = {
  /**
   *
   */
  toRaw: <T extends z.ZodTypeAny>(type: T): AnyToRaw<T> => {
    switch (type._def.typeName) {
      case z.ZodFirstPartyTypeKind.ZodObject:
        return objectType.toRaw(type as any) as T extends z.SomeZodObject
          ? ObjectToRaw<T>
          : never;
      default:
        return type._def.autoMap ? primitiveType.toRaw(type as any) : type;
    }
  },

  /**
   *
   */
  toMapped: <T extends z.ZodTypeAny>(type: T): AnyToMapped<T> => {
    switch (type._def.typeName) {
      case z.ZodFirstPartyTypeKind.ZodObject:
        return objectType.toMapped(type as any) as T extends z.SomeZodObject
          ? ObjectToMapped<T>
          : never;
      default:
        return type._def.autoMap ? primitiveType.toMapped(type as any) : type;
    }
  },
};

// PRIMITIVES

type PrimitiveToRaw<T extends AutoMapTypeAny> =
  T["_def"]["autoMap"]["state"] extends "mapped"
    ? RawType<T["_def"]["autoMap"]>
    : T;

type PrimitiveToMapped<T extends AutoMapTypeAny> =
  T["_def"]["autoMap"]["state"] extends "raw"
    ? MappedType<T["_def"]["autoMap"]>
    : T;

export const primitiveType = {
  /**
   *
   */
  toRaw: <T extends AutoMapType<AutoMapMetaAny>>(type: T) => {
    const autoMap = getAutoMap(type);
    return (
      autoMap
        ? autoMap.state === "mapped"
          ? autoMap.mapper.raw()
          : type
        : type
    ) as PrimitiveToRaw<T>;
  },

  /**
   *
   */
  toMapped: <T extends AutoMapType<AutoMapMetaAny>>(type: T) => {
    const autoMap = getAutoMap(type);
    return (
      autoMap
        ? autoMap.state === "raw"
          ? autoMap.mapper.mapped()
          : type
        : type
    ) as PrimitiveToMapped<T>;
  },
};

// OBJECTS

type ObjectToRaw<T extends z.SomeZodObject> = z.ZodObject<{
  [K in keyof T["shape"]]: AnyToRaw<T["shape"][K]>;
}>;

type ObjectToMapped<T extends z.SomeZodObject> = z.ZodObject<{
  [K in keyof T["shape"]]: AnyToMapped<T["shape"][K]>;
}>;

export const objectType = {
  /**
   *
   */
  toRaw: <T extends z.SomeZodObject>(object: T) =>
    z.object(
      Object.entries(object.shape).reduce(
        (acc, [key, type]) => ({ ...acc, [key]: any.toRaw(type) }),
        {} as ObjectToRaw<T>["shape"]
      )
    ) as ObjectToRaw<T>,

  /**
   *
   */
  toMapped: <T extends z.SomeZodObject>(object: T) =>
    z.object(
      Object.entries(object.shape).reduce(
        (acc, [key, type]) => ({ ...acc, [key]: any.toMapped(type) }),
        {} as ObjectToMapped<T>["shape"]
      )
    ) as ObjectToMapped<T>,
};

// ARRAYS

type ArrayToRaw<T extends z.ZodArray<z.ZodTypeAny>> = T extends z.ZodArray<
  infer E
>
  ? z.ZodArray<AnyToRaw<E>>
  : never;

type ArrayToMapped<T extends z.ZodArray<z.ZodTypeAny>> = T extends z.ZodArray<
  infer E
>
  ? z.ZodArray<AnyToMapped<E>>
  : never;

export const arrayType = {
  /**
   *
   */
  toRaw: <T extends z.ZodArray<z.ZodTypeAny>>(array: T) =>
    z.array(any.toRaw(array.element)) as ArrayToRaw<T>,

  /**
   *
   */
  toMapped: <T extends z.ZodArray<z.ZodTypeAny>>(array: T) =>
    z.array(any.toMapped(array.element)) as ArrayToMapped<T>,
};
