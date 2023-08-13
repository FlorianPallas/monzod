import { Converter } from ".";
import { MonzodObjectId } from "../../types";

export interface ObjectIdBSONSchema {
  bsonType: "objectId";
}

export const convertObjectId: Converter<
  MonzodObjectId,
  ObjectIdBSONSchema
> = () => ({
  bsonType: "objectId",
});
