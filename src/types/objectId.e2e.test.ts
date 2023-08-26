import { ObjectId } from "mongodb";
import { expect, test } from "vitest";
import { object } from "zod";
import { createTestCollection, insertAndFind } from "../../test/db";
import { bsonSchema } from "../bson-schema";
import { objectId, objectIdString } from "./objectId";

test("serializes", async () => {
  const schema = object({
    _id: objectId(),
  });
  type Schema = typeof schema._output;

  const collection = await createTestCollection<Schema>({
    validator: { $jsonSchema: bsonSchema(schema) },
  });

  const document = {
    _id: new ObjectId(),
  } satisfies Schema;

  const result = await insertAndFind(collection, document);
  expect(schema.parse(result)).toEqual(document);
  expect(
    objectIdString().parse(schema.parse(result)._id.toHexString())
  ).toBeDefined();
});
