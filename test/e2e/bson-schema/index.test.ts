import { expect, test } from "vitest";
import { createTestCollection } from "..";
import { bsonSchema, mz } from "../../../src";
import { z } from "zod";
import { ObjectId } from "mongodb";

test("handle undefined as error", async () => {
  const schema = z.object({
    _id: mz.objectId(),
    name: z.string().nullable(),
  });
  type Schema = z.infer<typeof schema>;

  const collection = await createTestCollection({
    validator: { $jsonSchema: bsonSchema(schema) },
    ignoreUndefined: true,
  });

  const validResult = await collection.insertOne({
    _id: new ObjectId(),
    name: null,
  } satisfies Schema);

  const invalidResult = collection.insertOne({
    _id: new ObjectId(),
    name: undefined,
  } satisfies Omit<Schema, "name"> & { name: undefined });

  expect(validResult.insertedId).toBeDefined();
  expect(invalidResult).rejects.toThrow();
});
