import db from "../../../database";

const collection = db.collection("users");

export async function addUser(user) {
  user.email = user.email.toLowerCase();
  const { ops: addedUser } = await collection.insertOne(user);
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
