import { expect, test } from "vitest";
import { ObjectId } from "mongodb";
import { mz, bsonSchema } from "../../src";
import { z } from "zod";
import { createTestCollection } from ".";

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
