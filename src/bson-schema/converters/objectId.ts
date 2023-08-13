import { Converter } from ".";
import { MonzodObjectId } from "../../types";

export interface ObjectIdBSONSchema {
  bsonType: "objectId";
}

export const objectId: Converter<MonzodObjectId, ObjectIdBSONSchema> = () => ({
  bsonType: "objectId",
});
