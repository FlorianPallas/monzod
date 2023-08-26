import { expect, test } from "vitest";
import { createTestCollection, insertAndFind } from "../../../test/db";
import { bsonSchema } from "..";
import { object, string } from "zod";
import { objectId } from "../../types";
import { ObjectId } from "mongodb";

test("serializes", async () => {
  const schema = object({
    _id: objectId(),
    value: string().min(3).max(5).regex(/^\d*$/),
  });
  type Schema = typeof schema._output;

  const doc = {
    _id: new ObjectId(),
    value: "1234",
  } satisfies Schema;

  const collection = await createTestCollection<Schema>({
    validator: { $jsonSchema: bsonSchema(schema) },
  });
  const result = await insertAndFind(collection, doc);

  expect(schema.parse(result)).toEqual(doc);
  expect(() =>
    collection.insertOne({
      ...doc,
      value: "12",
    })
  ).rejects.toThrow();
  expect(() =>
    collection.insertOne({
      ...doc,
      value: "123456",
    })
  ).rejects.toThrow();
  expect(() =>
    collection.insertOne({
      ...doc,
      value: "abcd",
    })
  ).rejects.toThrow();
});
