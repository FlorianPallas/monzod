import { CreateCollectionOptions, MongoClient } from "mongodb";
import { afterAll } from "vitest";
import { v4 as uuidV4 } from "uuid";

export const mongo = new MongoClient(process.env.VITE_MONGODB_URI!);
export const database = mongo.db(process.env.VITE_MONGODB_DATABASE!);

const testCollections: string[] = [];

export const createTestCollection = async (
  options?: CreateCollectionOptions
) => {
  const uuid = uuidV4();
  const collection = await database.createCollection(uuid, options);
  testCollections.push(uuid);
  return collection;
};

afterAll(async () => {
  await Promise.all(
    testCollections.map((name) => database.collection(name).drop())
  );
  await mongo.close();
});
