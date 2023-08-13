import { ZodType, ZodFirstPartyTypeKind, ZodOptional } from "zod";
import { bsonSchema } from ".";
import { getKind } from "../types";
import { BSONSchema } from "./converters";

export type UnwrapResult = {
  schema: BSONSchema;
  modifiers: UnwrapModifiers;
};

export type UnwrapModifiers = {
  isOptional: boolean;
};

export const unwrap = (
  type: ZodType,
  modifiers: UnwrapModifiers = {
    isOptional: false,
  }
): UnwrapResult => {
  switch (getKind(type)) {
    case ZodFirstPartyTypeKind.ZodOptional:
      return unwrap((type as ZodOptional<ZodType>).unwrap(), {
        ...modifiers,
        isOptional: true,
      });
    default:
      return { schema: bsonSchema(type), modifiers };
  }
};
