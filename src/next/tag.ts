import { z } from "zod";
import { meta } from "./meta";

export const tag = <T extends z.ZodTypeAny, U extends string>(
  type: T,
  tag: U
) => meta(type, { tag });

export type Tagged<
  T extends z.ZodTypeAny,
  U extends string,
> = T["_def"] extends {
  tag: U;
}
  ? T
  : never;

type NonNeverKeys<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];

type NonNever<T> = Pick<T, NonNeverKeys<T>>;

type NonEmptyOrNever<T extends z.ZodObject<z.ZodRawShape>> = NonNeverKeys<
  T["shape"]
> extends never
  ? never
  : T;

export type TaggedKeys<
  T extends z.ZodRawShape,
  U extends string,
> = NonNeverKeys<{
  [K in keyof T]: Tagged<T[K], U> extends never ? never : K;
}>;

type PickTag<
  T extends z.ZodObject<z.ZodRawShape>,
  U extends string,
> = z.ZodObject<
  {
    [K in keyof T["shape"]]: T["shape"][K] extends z.ZodObject<z.ZodRawShape>
      ? NonEmptyOrNever<PickTag<T["shape"][K], U>>
      : K extends TaggedKeys<T["shape"], U>
      ? T["shape"][K]
      : never;
  } extends infer S
    ? NonNever<S>
    : never
>;

type OmitTag<
  T extends z.ZodObject<z.ZodRawShape>,
  U extends string,
> = z.ZodObject<
  {
    [K in keyof T["shape"]]: T["shape"][K] extends z.ZodObject<z.ZodRawShape>
      ? NonEmptyOrNever<OmitTag<T["shape"][K], U>>
      : K extends TaggedKeys<T["shape"], U>
      ? never
      : T["shape"][K];
  } extends infer S
    ? NonNever<S>
    : never
>;

export const pickTag = <T extends z.ZodObject<z.ZodRawShape>, U extends string>(
  schema: T,
  tag: U
): PickTag<T, U> => {
  const newShape = Object.entries(schema.shape).reduce(
    (acc, [key, type]) => {
      // handle nested objects by recursively picking by tag
      if (type._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
        const objectType = type as z.ZodObject<z.ZodRawShape>;
        const nestedObject = pickTag(objectType, tag);
        // omit empty objects
        return Object.keys(nestedObject.shape).length > 0
          ? { ...acc, [key]: nestedObject }
          : acc;
      }

      // handle primitives
      const hasTag = type._def.tag === tag;
      return hasTag ? { ...acc, [key]: type } : acc;
    },
    {} as PickTag<T, U>["shape"]
  );
  return z.object(newShape);
};

export const omitTag = <T extends z.ZodObject<z.ZodRawShape>, U extends string>(
  schema: T,
  tag: U
): OmitTag<T, U> => {
  const newShape = Object.entries(schema.shape).reduce(
    (acc, [key, type]) => {
      // handle nested objects by recursively picking by tag
      if (type._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
        const objectType = type as z.ZodObject<z.ZodRawShape>;
        const nestedObject = omitTag(objectType, tag);
        // omit empty objects
        return Object.keys(nestedObject.shape).length > 0
          ? { ...acc, [key]: nestedObject }
          : acc;
      }

      // handle primitives
      const hasTag = type._def.tag === tag;
      return hasTag ? acc : { ...acc, [key]: type };
    },
    {} as OmitTag<T, U>["shape"]
  );
  return z.object(newShape);
};
