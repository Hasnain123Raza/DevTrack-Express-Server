import mongodb from "mongodb";
import db from "../../../database";

const collection = db.collection("users");

export async function addUser(user) {
  const dbUser = {
    displayName: user.displayName,
    email: user.email.toLowerCase(),
    password: user.password,
    role: "unverified",
  };

  const { ops: addedUser } = await collection.insertOne(dbUser);
  return addedUser;
}

export async function checkDisplayNameDuplication(displayName) {
  const displayNameCursor = collection
    .find({ displayName })
    .collation({ locale: "en_US", strength: 1 })
    .limit(1);

  return await displayNameCursor.hasNext();
}

export async function checkEmailDuplication(email) {
  const emailCursor = collection.find({ email }).limit(1);
  return await emailCursor.hasNext();
}

export async function getSimplifiedUserByEmail(email) {
  const emailAggregationCursor = collection.aggregate([
    { $project: { _id: 1, displayName: 1, email: 1, password: 1, role: 1 } },
    { $match: { email } },
  ]);

  return await emailAggregationCursor.next();
}

export async function getSimplifiedUserById(id) {
  id = new mongodb.ObjectID(id);
  const idAggregationCursor = collection.aggregate([
    { $project: { _id: 1, displayName: 1, email: 1, password: 1, role: 1 } },
    { $match: { _id: id } },
  ]);

  return await idAggregationCursor.next();
}
