import { expect, test } from "vitest";
import { ObjectId } from "mongodb";
import { mz, bsonSchema } from "../../src";
import { z } from "zod";
import { createTestCollection, insertAndFind } from ".";

test("basic model validation", async () => {
  // Arrange
  const userSchema = z.object({
    _id: mz.objectId(),
    name: z.string(),
    email: z.string().email(),
  });
  type User = z.infer<typeof userSchema>;

  const collection = await createTestCollection({
    validator: {
      $jsonSchema: bsonSchema(userSchema),
    },
  });

  const validUser = {
    _id: new ObjectId(),
    name: "John Doe",
    email: "john.doe@example.com",
  } satisfies User;

  const invalidUser = {
    _id: new ObjectId(),
    name: "John Doe",
  } satisfies Omit<User, "email">;

  // Act
  const validResult = await collection.insertOne(validUser);
  const invalidPromise = collection.insertOne(invalidUser as User);

  // Assert
  expect(validResult.insertedId).toBeDefined();
  expect(invalidPromise).rejects.toThrow();
});

test("objectId serialization", async () => {
  const collection = await createTestCollection();
  const result = await insertAndFind(collection, { _id: new ObjectId() });

  expect(() => mz.objectId().parse(result!._id)).toBeDefined(); // Maps are not correctly returned as maps
});

test("map serialization", async () => {
  const collection = await createTestCollection();
  const result = await insertAndFind(collection, {
    map: new Map([
      ["a", "valA"],
      ["b", "valB"],
      ["c", "valC"],
    ]),
  });

  expect(() => z.map(z.string(), z.string()).parse(result!.map)).toThrow(); // Maps are not correctly returned as maps
});

test("set serialization", async () => {
  const collection = await createTestCollection();
  const result = await insertAndFind(collection, {
    set: new Set(["a", "b", "c"]),
  });

  expect(() => z.set(z.string()).parse(result!.set)).toThrow(); // Sets are not correctly returned as sets
});

test("date serialization", async () => {
  const collection = await createTestCollection();
  const date = new Date("2000-01-01T00:00:00.000Z");
  const result = await insertAndFind(collection, { date });

  expect(z.date().parse(result!.date)).toEqual(date); // Dates are correctly returned as dates
});

test("bigint serialization", async () => {
  const collection = await createTestCollection();
  const result = await insertAndFind(collection, { value: BigInt(1234) });

  expect(() => z.bigint().parse(result!.bigint)).toThrow(); // BigInts are not correctly returned as bigints
});
