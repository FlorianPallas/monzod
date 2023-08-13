import { describe, expect, test } from "vitest";
import { mz } from "../..";
import { convertObjectId } from ".";

describe("zod objectId converter", () => {
  test("objectId", () => {
    const schema = mz.objectId();
    const bsonSchema = convertObjectId(schema);
    expect(bsonSchema).toEqual({ bsonType: "objectId" });
  });
});
