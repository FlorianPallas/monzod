import {
  Collection,
  CreateCollectionOptions,
  MongoClient,
  WithId,
  Document,
  OptionalId,
} from "mongodb";
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

export const insertAndFind = async <T extends OptionalId<Document>>(
  collection: Collection,
  value: T
) => {
  const inserted = await collection.insertOne(value);
  const found = await collection.findOne({ _id: inserted.insertedId });
  if (!found) throw new Error("Document not found");
  return found;
};

afterAll(async () => {
  await Promise.all(
    testCollections.map((name) => database.collection(name).drop())
  );
  await mongo.close();
});
