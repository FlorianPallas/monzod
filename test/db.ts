import {
  Collection,
  CreateCollectionOptions,
  MongoClient,
  Document,
} from "mongodb";
import { v4 as uuidV4 } from "uuid";

export const mongo = new MongoClient(process.env.VITE_MONGODB_URI!);
export const database = mongo.db(process.env.VITE_MONGODB_DATABASE!);
export const SESSION_ID = uuidV4();

export const createTestCollection = async <T extends Document>(
  options?: CreateCollectionOptions
) => {
  console.log(`creating test collection...`);
  const name = `${SESSION_ID}.${uuidV4()}`;
  const collection = database.createCollection<T>(name, options);
  console.log(`created test collection ${name}`);
  return collection;
};

export const dropTestCollections = async () => {
  const collections = (await database.listCollections().toArray()).filter((c) =>
    c.name.startsWith(SESSION_ID)
  );
  console.log(`dropping test collections...`);
  await Promise.all(collections.map((c) => database.dropCollection(c.name)));
  console.log(`dropped ${collections.length} collections`);
};

export const insertAndFind = async (
  collection: Collection<any>,
  value: any
) => {
  const { insertedId } = await collection.insertOne(value);
  const found = await collection.findOne({ _id: insertedId });
  if (!found) throw new Error("Document not found");
  return found as unknown;
};
