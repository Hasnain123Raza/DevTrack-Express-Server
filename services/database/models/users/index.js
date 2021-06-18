import db from "../../../database";

const collection = db.collection("users");

export function addUser(user) {
  try {
    const insertedUser = collection.insertOne(user);
    return { success: true, payload: insertedUser };
  } catch (error) {
    return { success: false, errors: [error] };
  }
}
