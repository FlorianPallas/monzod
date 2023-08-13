import { ObjectId } from "mongodb";
import { ZodType, ZodTypeDef, custom, string } from "zod";
import { MonzodType, MonzodTypeKind, addMetadata } from "./monzod";
import { isBsonType } from "./bson";

export type MonzodObjectId = MonzodType<
  ZodType<ObjectId, ZodTypeDef, ObjectId>,
  { typeName: MonzodTypeKind.ObjectId }
>;

export const objectId = (): MonzodObjectId =>
  addMetadata(
    custom<ObjectId>((val) => isBsonType(val, "ObjectId")),
    { typeName: MonzodTypeKind.ObjectId },
  );

export const objectIdString = () =>
  string()
    .min(24)
    .max(24)
    .regex(/^[a-f\d]{24}$/i);
