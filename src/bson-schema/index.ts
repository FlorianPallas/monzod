import {
  ZodArray,
  ZodBoolean,
  ZodFirstPartyTypeKind,
  ZodNumber,
  ZodObject,
  ZodRawShape,
  ZodSet,
  ZodString,
  ZodTuple,
  ZodType,
  ZodTypeAny,
} from "zod";
import { MonzodObjectId, MonzodTypeKind, getKind } from "../types";
import * as Converters from "./converters";

export const bsonSchema = (type: ZodType): Converters.BSONSchema => {
  const kind = getKind(type);

  switch (kind) {
    case MonzodTypeKind.ObjectId:
      return Converters.objectId(type as MonzodObjectId);
    case ZodFirstPartyTypeKind.ZodString:
      return Converters.string(type as ZodString);
    case ZodFirstPartyTypeKind.ZodNumber:
      return Converters.number(type as ZodNumber);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return Converters.bool(type as ZodBoolean);
    case ZodFirstPartyTypeKind.ZodArray:
      return Converters.array(type as ZodArray<ZodType>);
    case ZodFirstPartyTypeKind.ZodTuple:
      return Converters.tuple(
        type as ZodTuple<[] | [ZodTypeAny, ...ZodTypeAny[]]>
      );
    case ZodFirstPartyTypeKind.ZodSet:
      return Converters.set(type as ZodSet);
    case ZodFirstPartyTypeKind.ZodObject:
      return Converters.object(type as ZodObject<ZodRawShape>);
    case ZodFirstPartyTypeKind.ZodOptional:
    case ZodFirstPartyTypeKind.ZodNullable:
      throw new Error(`Unexpected wrapper type "${kind}"`);
    default:
      throw new Error(`Unsupported type "${kind}"`);
  }
};
