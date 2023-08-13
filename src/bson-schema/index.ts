import {
  ZodArray,
  ZodBoolean,
  ZodEnum,
  ZodFirstPartyTypeKind,
  ZodNull,
  ZodNullable,
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
import * as Converter from "./converters";

export const bsonSchema = (type: ZodType): Converter.BSONSchema => {
  const kind = getKind(type);

  switch (kind) {
    // Wrappers
    case ZodFirstPartyTypeKind.ZodNullable:
      return Converter.convertNullable(type as ZodNullable<ZodType>);
    case ZodFirstPartyTypeKind.ZodOptional:
      throw new Error(
        "Your schema uses optional types outside the object scope. This is currently not supported. Consider using nullable types instead."
      );

    // BSON
    case MonzodTypeKind.ObjectId:
      return Converter.convertObjectId(type as MonzodObjectId);

    // Primitives
    case ZodFirstPartyTypeKind.ZodString:
      return Converter.convertString(type as ZodString);
    case ZodFirstPartyTypeKind.ZodNumber:
      return Converter.convertNumber(type as ZodNumber);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return Converter.convertBool(type as ZodBoolean);

    // Empty Types
    case ZodFirstPartyTypeKind.ZodNull:
      return Converter.convertNull(type as ZodNull);

    // Catch All Types

    // Never Type

    // Complex Types
    case ZodFirstPartyTypeKind.ZodArray:
      return Converter.convertArray(type as ZodArray<ZodType>);
    case ZodFirstPartyTypeKind.ZodObject:
      return Converter.convertObject(type as ZodObject<ZodRawShape>);
    case ZodFirstPartyTypeKind.ZodTuple:
      return Converter.convertTuple(
        type as ZodTuple<[] | [ZodTypeAny, ...ZodTypeAny[]]>
      );
    case ZodFirstPartyTypeKind.ZodSet:
      return Converter.convertSet(type as ZodSet);
    case ZodFirstPartyTypeKind.ZodSet:
      return Converter.convertEnum(type as ZodEnum<[string, ...string[]]>);

    default:
      throw new Error(`Unsupported type "${kind}"`);
  }
};
