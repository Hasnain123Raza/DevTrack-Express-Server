import db from "../..";

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
    { $project: { displayName: 1, email: 1, password: 1, role: 1 } },
    { $match: { email } },
  ]);

  return await emailAggregationCursor.next();
}

export async function getSimplifiedUserById(_id) {
  const idAggregationCursor = collection.aggregate([
    {
      $project: {
        displayName: 1,
        email: 1,
        password: 1,
        role: 1,
        robloxUserId: 1,
      },
    },
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

export async function setROBLOXUserId(_id, robloxUserId) {
  return await collection.updateOne(
    { _id },
    {
      $set: {
        robloxUserId,
      },
    },
    {}
  );
}

export async function removeROBLOXUserId(_id) {
  return await collection.updateOne(
    { _id },
    {
      $unset: {
        robloxUserId: null,
      },
    },
    {}
  );
}
