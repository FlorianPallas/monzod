import { ObjectId } from "mongodb";
import { z } from "zod";
import { mapSchema, mapsTo } from "./mapping";
import { expect, expectTypeOf, test } from "vitest";
import { mz } from "..";
import { omitTag, pickTag, tag } from "./tag";

const addressSchema = z.object({
  _id: mapsTo(mz.objectId(), {
    type: mz.objectIdString(),
    value: (value) => value.toHexString(),
    key: "id",
  }),
  street: tag(z.string(), "hidden"),
  city: tag(z.string(), "editable"),
  zip: tag(z.string(), "editable"),
});

type Address = z.infer<typeof addressSchema>;
//   ^?

const userSchema = z.object({
  _id: mapsTo(mz.objectId(), {
    type: mz.objectIdString(),
    value: (value) => value.toHexString(),
    key: "id",
  }),
  name: tag(z.string(), "editable"),
  age: tag(z.number(), "editable"),
  thumbnailUrl: z.string().url().optional(),
  passwordHash: tag(z.string(), "hidden"),
  address: addressSchema,
});

const userDTOSchema = mapSchema(omitTag(userSchema, "hidden"));

const userParamsSchema = pickTag(userSchema, "editable").extend({
  thumbnailFileId: mapsTo(mz.objectId().optional(), {
    type: mz.objectIdString().optional(),
    value: (value) => value?.toHexString(),
    key: "thumbnailFileId",
  }),
});
const userParamsDTOSchema = mapSchema(userParamsSchema);

type User = z.infer<typeof userSchema>;
//   ^?
type UserDTO = z.infer<typeof userDTOSchema>;
//   ^?
type UserParams = z.infer<typeof userParamsSchema>;
//   ^?
type UserParamsDTO = z.infer<typeof userParamsDTOSchema>;
//   ^?

test("", () => {
  expectTypeOf<User>().toEqualTypeOf<{
    _id: ObjectId;
    name: string;
    age: number;
    passwordHash: string;
    thumbnailUrl?: string;
    address: Address;
  }>();

  expect(Object.keys(userDTOSchema.shape)).toEqual([
    "id",
    "name",
    "age",
    "thumbnailUrl",
    "address",
  ]);

  expect(Object.keys(userDTOSchema.shape.address.shape)).toEqual([
    "id",
    "city",
    "zip",
  ]);

  expectTypeOf<UserDTO>().toEqualTypeOf<{
    id: string;
    name: string;
    age: number;
    thumbnailUrl?: string;
    address: {
      id: string;
      city: string;
      zip: string;
    };
  }>();

  expect(Object.keys(userParamsSchema.shape)).toEqual([
    "name",
    "age",
    "address",
    "thumbnailFileId",
  ]);

  expect(Object.keys(userParamsSchema.shape.address.shape)).toEqual([
    "city",
    "zip",
  ]);

  expectTypeOf<UserParams>().toEqualTypeOf<{
    name: string;
    age: number;
    thumbnailFileId?: ObjectId;
    address: {
      city: string;
      zip: string;
    };
  }>();

  expect(Object.keys(userParamsDTOSchema.shape)).toEqual([
    "name",
    "age",
    "address",
    "thumbnailFileId",
  ]);

  expect(Object.keys(userParamsDTOSchema.shape.address.shape)).toEqual([
    "city",
    "zip",
  ]);

  expectTypeOf<UserParamsDTO>().toEqualTypeOf<{
    name: string;
    age: number;
    thumbnailFileId?: string;
    address: {
      city: string;
      zip: string;
    };
  }>();
});
