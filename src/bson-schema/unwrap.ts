import { ZodType, ZodFirstPartyTypeKind, ZodOptional, ZodNullable } from "zod";
import { getKind } from "../types";

export const unwrapOptional = (type: ZodType) => {
  const isOptional = getKind(type) === ZodFirstPartyTypeKind.ZodOptional;
  return {
    type: isOptional ? (type as ZodOptional<ZodType>).unwrap() : type,
    isOptional,
  };
};

export const unwrapNullable = (type: ZodType) => {
  const isNullable = getKind(type) === ZodFirstPartyTypeKind.ZodNullable;
  return {
    type: isNullable ? (type as ZodNullable<ZodType>).unwrap() : type,
    isNullable,
  };
};
