import { z } from "zod";

export const meta = <T extends z.ZodTypeAny, U>(type: T, additional: U) => {
  const This = (type as any).constructor;
  return new This({
    ...type._def,
    ...additional,
  }) as T & { _def: Omit<T["_def"], keyof U> & U };
};
