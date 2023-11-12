import { z } from "zod";
import { meta } from "./meta";

export type AutoMapMeta<
  Raw extends z.ZodType = z.ZodType,
  Mapped extends z.ZodType = z.ZodType,
  State extends "mapped" | "raw" = "mapped" | "raw",
> = { mapper: Mapper<Raw, Mapped>; state: State };
export type AutoMapMetaAny = AutoMapMeta<any, any, any>;

export type AutoMapType<M extends AutoMapMeta = AutoMapMetaAny> = {
  _def: { autoMap: M };
};
export type AutoMapTypeAny = { _def: { autoMap: AutoMapMetaAny } };

export class Mapper<
  Raw extends z.ZodType = z.ZodType,
  Mapped extends z.ZodType = z.ZodType,
> {
  constructor(
    private _type: {
      raw: Raw;
      mapped: Mapped;
    },
    private _value: {
      toRaw: (value: z.infer<Mapped>) => z.infer<Raw>;
      toMapped: (value: z.infer<Raw>) => z.infer<Mapped>;
    }
  ) {}

  public mapped = () =>
    meta(this._type.mapped, {
      autoMap: {
        mapper: this,
        state: "mapped" as const,
      },
    });
  public toMapped = this._value.toMapped;

  public raw = () =>
    meta(this._type.raw, {
      autoMap: {
        mapper: this,
        state: "raw" as const,
      },
    });
  public toRaw = this._value.toRaw;
}
