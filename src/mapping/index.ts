import { ZodRawShape, z } from "zod";
import { ObjectId } from "mongodb";
import { objectId, objectIdString } from "../types/objectId";
import { MonzodTypeKind, getMonzodKind } from "../types/monzod";

const objectIdType = objectId();
type MapKey<TKey> = TKey extends "_id" ? "id" : TKey;

export const mapKey = <TKey>(key: TKey) =>
  (key === "_id" ? "id" : key) as MapKey<TKey>;

type MapType<TSchema extends z.ZodType> = z.infer<TSchema> extends ObjectId
  ? z.ZodString
  : TSchema;

export const mapType = <TSchema extends z.ZodType>(type: TSchema) =>
  (getMonzodKind(type) === MonzodTypeKind.ObjectId
    ? objectIdString()
    : type) as MapType<TSchema>;

type MapValue<TValue> = TValue extends ObjectId ? string : TValue;

export const mapValue = <TValue>(value: TValue) => {
  const parsed = objectIdType.safeParse(value);
  return (
    parsed.success ? parsed.data.toHexString() : value
  ) as MapValue<TValue>;
};

/**
 * Converts a zod shape to a new shape with the same keys, but with the following changes:
 * - The `_id` key gets renamed to `id`
 * - Any `mz.objectId()` type is replaced with `mz.objectIdString()`
 *
 * @example
 * {
 *   _id: mz.objectId(),      ->  id: mz.objectIdString()
 *   name: z.string(),        ->  name: z.string()
 *   groupId: mz.objectId(),  ->  groupId: mz.objectIdString()
 * }
 *
 * @param shape the shape to convert
 * @returns the converted shape
 */
export const mapShape = <TShape extends z.ZodRawShape>(shape: TShape) => {
  const newShape = {} as ZodRawShape;

  Object.entries(shape).forEach(([key, value]) => {
    newShape[mapKey(key)] = mapType(value);
  });

  return newShape as {
    [K in keyof TShape as MapKey<K>]: MapType<TShape[K]>;
  };
};

/**
 * Converts a zod schema to a new schema with the same keys, but with the following changes:
 * - The `_id` key gets renamed to `id`
 * - Any `mz.objectId()` type is replaced with `mz.objectIdString()`
 *
 * This makes it easy to create DTO schemas from your mongodb entity schemas.
 *
 * @example
 * z.object({
 *   _id: mz.objectId(),      ->  id: mz.objectIdString()
 *   name: z.string(),        ->  name: z.string()
 *   groupId: mz.objectId(),  ->  groupId: mz.objectIdString()
 * });
 *
 * @param object the schema to convert
 * @returns the converted schema
 */
export const mapSchema = <TShape extends ZodRawShape>(
  object: z.ZodObject<TShape>,
) => z.object(mapShape<TShape>(object.shape));

/**
 * Converts an entity to an object with the same keys, but with the following changes:
 * - The `_id` key gets renamed to `id`
 * - Any `ObjectId` type is stringified with `toHexString()`
 *
 * The objects created like this, pass the zod validation of the DTO schemas created with `mz.convert()`.
 *
 * This makes it easy to convert mongodb entities to DTOs.
 *
 * @example
 * const user = {
 *   _id: new ObjectId("507...f1f"),      ->  id: "507...f1f"
 *   name: "John Doe",                    ->  name: "John Doe",
 *   groupId: new ObjectId("72a...9de"),  ->  groupId: "72a...9de",
 * };
 *
 * @param entity the entity to convert
 * @returns the converted entity
 */
export const mapEntity = <T extends Record<string, any>>(entity: T) => {
  const newEntity = {} as Record<string, any>;

  Object.entries(entity).forEach(([key, value]) => {
    newEntity[mapKey(key)] = mapValue(value);
  });

  return newEntity as {
    [K in keyof T as MapKey<K>]: MapValue<T[K]>;
  };
};
