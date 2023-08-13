import { describe, expect, it, test } from "vitest";
import { isBsonType } from "./bson";
import { Double, ObjectId } from "mongodb";

describe("bson", () => {
  it("should parse bson types", () => {
    expect(isBsonType(new ObjectId())).toBeTruthy();
    expect(isBsonType(new Double(42))).toBeTruthy();
  });

  it("should fail parsing other types", () => {
    expect(isBsonType("John")).toBeFalsy();
    expect(isBsonType("John", "ObjectId")).toBeFalsy();
  });

  it("should only parse the specified bson type", () => {
    test("", () => {
      expect(isBsonType(new ObjectId(), "ObjectId")).toBeTruthy();
      expect(isBsonType(new ObjectId(), "Double")).toBeFalsy();
      expect(isBsonType(new Double(42), "Double")).toBeTruthy();
      expect(isBsonType(new Double(42), "ObjectId")).toBeFalsy();
    });
  });
});
