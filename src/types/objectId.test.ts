import { assertType, describe, expect, it } from "vitest";
import { objectId, objectIdString } from "./objectId";
import { Double, ObjectId } from "mongodb";

describe("objectId", () => {
  it("should parse object ids", () => {
    expect(objectId().safeParse(new ObjectId()).success).toBeTruthy();
  });

  it("should fail parsing other types", () => {
    expect(objectId().safeParse("John").success).toBeFalsy();
    expect(objectId().safeParse(42).success).toBeFalsy();
    expect(objectId().safeParse(false).success).toBeFalsy();
    expect(objectId().safeParse(undefined).success).toBeFalsy();
    expect(objectId().safeParse(null).success).toBeFalsy();
  });

  it("should fail parsing other bson types", () => {
    expect(objectId().safeParse(new Double(42)).success).toBeFalsy();
  });

  it("should parse to object id type", () => {
    assertType<ObjectId>(objectId().parse(new ObjectId()));
  });
});

describe("objectIdString", () => {
  it("should parse hex formatted object ids", () => {
    expect(
      objectIdString().safeParse(new ObjectId().toHexString()).success
    ).toBeTruthy();
  });

  it("should fail parsing strings of invalid length", () => {
    expect(
      objectIdString().safeParse("1234567890123456789012345").success
    ).toBeFalsy();
    expect(
      objectIdString().safeParse("12345678901234567890123").success
    ).toBeFalsy();
  });

  it("should fail parsing strings with uppercase letters", () => {
    expect(
      objectIdString().safeParse("A2345678901234567890123").success
    ).toBeFalsy();
  });
});
