import { ZodFirstPartyTypeKind, ZodType } from "zod";

export type MonzodType<TZod extends ZodType, TMonzod extends object> = TZod & {
  _monzod: TMonzod;
};

export enum MonzodTypeKind {
  ObjectId = "MonzodObjectId",
}

export const getZodKind = (type: ZodType) =>
  "typeName" in type._def
    ? (type._def.typeName as ZodFirstPartyTypeKind)
    : undefined;

export const getMonzodKind = (type: ZodType) => {
  const monzodType = getMetadata(type);
  return monzodType && "typeName" in monzodType
    ? (monzodType.typeName as MonzodTypeKind)
    : undefined;
};

export const getKind = (type: ZodType) =>
  getMonzodKind(type) ?? getZodKind(type);

export const addMetadata = <TMonzod extends object, TZod extends ZodType>(
  type: TZod,
  definition: TMonzod
) => {
  const t = type as MonzodType<TZod, TMonzod>;
  t._monzod = definition;
  return t;
};

export const getMetadata = <T extends ZodType>(type: T) =>
  "_monzod" in type && typeof type._monzod === "object" && type._monzod !== null
    ? type._monzod
    : undefined;
