import { describe, expect, test } from "vitest";
import { mz } from "../..";
import { objectId } from ".";

describe("zod objectId converter", () => {
  test("objectId", () => {
    const schema = mz.objectId();
    const bsonSchema = objectId(schema);
    expect(bsonSchema).toEqual({ bsonType: "objectId" });
  });
});
