import { mongo, dropTestCollections } from "./db";

export async function setup() {
  await mongo.connect();
}

export async function teardown() {
  await dropTestCollections();
  await mongo.close();
}
