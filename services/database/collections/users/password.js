import db from "../..";

const collection = db.collection("users");

export async function setPasswordToken(_id, passwordToken) {
  return await collection.updateOne(
    { _id },
    {
      $set: {
        passwordToken,
      },
    },
    {}
  );
}

export async function removePasswordToken(_id) {
  return await collection.updateOne(
    { _id },
    {
      $unset: {
        passwordToken: null,
      },
    },
    {}
  );
}

export async function getPasswordToken(_id) {
  const idAggregationCursor = collection.aggregate([
    { $project: { passwordToken: 1 } },
    { $match: { _id } },
  ]);

  return await idAggregationCursor.next();
}

export async function setPassword(_id, hashedPassword) {
  return await collection.updateOne(
    { _id },
    {
      $set: {
        password: hashedPassword,
      },
    },
    {}
  );
}
