import db from "../..";

const collection = db.collection("users");

export async function setEmailVerificationToken(_id, emailVerificationToken) {
  return await collection.updateOne(
    { _id },
    {
      $set: {
        emailVerificationToken,
      },
    },
    {}
  );
}

export async function removeEmailVerificationToken(_id) {
  return await collection.updateOne(
    { _id },
    {
      $unset: {
        emailVerificationToken: null,
      },
    },
    {}
  );
}

export async function getEmailVerificationToken(_id) {
  const idAggregationCursor = collection.aggregate([
    { $project: { emailVerificationToken: 1 } },
    { $match: { _id } },
  ]);

  return await idAggregationCursor.next();
}

export async function setEmailVerified(_id) {
  return await collection.updateOne(
    { _id },
    {
      $set: {
        role: "verified",
      },
    },
    {}
  );
}
