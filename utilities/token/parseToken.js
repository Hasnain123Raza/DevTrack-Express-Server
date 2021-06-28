import { validate as uuidValidate } from "uuid";
import mongodb from "mongodb";

export default function parseToken(token) {
  const splitted = token.split(":");
  if (splitted.length !== 2) return { success: false };

  const _idPart = splitted[0];
  if (_idPart.length !== 24) return { success: false };

  const uuid = splitted[1];
  if (!uuidValidate(uuid)) return { success: false };

  const _id = new mongodb.ObjectId(_idPart);
  return { success: true, _id, uuid };
}
