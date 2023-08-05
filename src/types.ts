import { ObjectId } from "mongodb";
import { z } from "zod";

export const id = () => z.instanceof(ObjectId);

export const idString = () =>
  z
    .string()
    .min(24)
    .max(24)
    .regex(/^[a-f\d]{24}$/i);

