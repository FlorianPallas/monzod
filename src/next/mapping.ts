import { z } from "zod";
import { meta } from "./meta";

export type Mapping<
  Input extends z.ZodTypeAny,
  Output extends z.ZodTypeAny,
  Key extends string | undefined,
> = {
  type: Output;
  value: (value: z.infer<Input>) => z.infer<Output>;
  key?: Key;
};

export const mapsTo = <
  Input extends z.ZodTypeAny,
  Output extends z.ZodTypeAny,
  Key extends string | undefined = undefined,
>(
  input: Input,
  mapping: Mapping<Input, Output, Key>
) => meta(input, { mapping });

export const mapType = <
  Input extends z.ZodTypeAny,
  Output extends z.ZodTypeAny,
  Key extends string | undefined,
>(
  type: Input & { _def: { mapping: Mapping<Input, Output, Key> } }
) => type._def.mapping.type as Output;

export const mapValue = <
  Input extends z.ZodTypeAny,
  Output extends z.ZodTypeAny,
  Key extends string | undefined,
>(
  type: Input & { _def: { mapping: Mapping<Input, Output, Key> } },
  value: z.infer<Input>
) =>
  type._def.mapping.type.parse(
    type._def.mapping.value(value)
  ) as z.infer<Output>;

export const mapKey = <
  T extends string,
  Input extends z.ZodTypeAny,
  Output extends z.ZodTypeAny,
  Key extends string | undefined,
>(
  type: Input & { _def: { mapping: Mapping<Input, Output, Key> } },
  key: T
): Key extends undefined ? T : Key => type._def.mapping.key ?? key;

export type MapKey<
  T extends z.ZodTypeAny,
  K extends string | number | symbol,
> = T["_def"] extends {
  mapping: Mapping<any, any, infer X>;
}
  ? X extends undefined
    ? K
    : X
  : K;

export type MapType<T extends z.ZodTypeAny> =
  T extends z.ZodObject<z.ZodRawShape>
    ? MapSchema<T>
    : T["_def"] extends {
        mapping: Mapping<any, infer X, any>;
      }
    ? X
    : T;

export type MapSchema<T extends z.ZodObject<z.ZodRawShape>> = z.ZodObject<{
  [K in keyof T["shape"] as MapKey<T["shape"][K], K>]: MapType<T["shape"][K]>;
}>;

export const mapSchema = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T
): MapSchema<T> => {
  const newShape = Object.entries(schema.shape).reduce(
    (acc, [key, type]) => {
      // handle nested objects
      if (type._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
        const objectType = type as z.ZodObject<z.ZodRawShape>;
        const nestedObject = mapSchema(objectType);
        return { ...acc, [key]: nestedObject };
      }

      // handle primitives
      const hasMapping = type._def.mapping !== undefined;
      if (!hasMapping) return { ...acc, [key]: type };
      return { ...acc, [mapKey(type, key)]: mapType(type) };
    },
    {} as MapSchema<T>["shape"]
  );
  return z.object(newShape);
};

export type MapObject<T extends z.ZodObject<z.ZodRawShape>> = z.infer<
  MapSchema<T>
>;

export const mapObject = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  object: z.infer<T>
): MapObject<T> => {
  const newObject = Object.entries(schema.shape).reduce((acc, [key, type]) => {
    // handle objects
    if (type._def.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
      const objectType = type as z.ZodObject<z.ZodRawShape>;
      const nestedObject = mapObject(objectType, object[key]);
      return { ...acc, [key]: nestedObject };
    }

    // handle primitives
    const hasMapping = type._def.mapping !== undefined;
    if (!hasMapping) return { ...acc, [key]: object[key] };
    return { ...acc, [mapKey(type, key)]: mapValue(type, object[key]) };
  }, {} as MapObject<T>);
  return newObject;
};
