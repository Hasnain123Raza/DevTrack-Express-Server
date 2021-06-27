import db from "../..";

const collection = db.collection("users");

export async function setToken(_id, name, value) {
  return await collection.updateOne(
    { _id },
    {
      $set: {
        [name]: value,
      },
    },
    {}
  );
}

export async function removeToken(_id, name) {
  return await collection.updateOne(
    { _id },
    {
      $unset: {
        [name]: null,
      },
    },
    {}
  );
}

export async function getToken(_id, name) {
  const idAggregationCursor = collection.aggregate([
    { $project: { [name]: 1 } },
    { $match: { _id } },
  ]);

  return await idAggregationCursor.next();
}
