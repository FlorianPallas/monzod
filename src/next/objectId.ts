import { ObjectId } from "mongodb";
import { Mapper } from "./mapper";
import { z } from "zod";

export const objectIdMapper = new Mapper(
  {
    mapped: z
      .string()
      .min(24)
      .max(24)
      .regex(/^[a-f\d]{24}$/i),
    raw: z.instanceof(ObjectId),
  },
  {
    toMapped: (value) => value.toHexString(),
    toRaw: (value) => new ObjectId(value),
  }
);

export const objectId = () => objectIdMapper.raw();
export const objectIdString = () => objectIdMapper.mapped();
