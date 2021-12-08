const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const saltRounds = 16;
const validate = require("./validation");
const { ObjectId } = require("mongodb");
//const { getProductById } = require("./products");

async function getUsers() {
  const userCollection = await users();
  const allUsers = await userCollection.find({}).toArray();

  // Change all _id values to strings
  return allUsers.map(validate.convertObjId);
}

async function getUserById(id) {
  if (!validate.validString(id)) throw "User id must be a valid string.";
  let objId = ObjectId(id.trim());
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: objId });

  if (!user) throw `No user found with id=${id}.`;

  // Convert _id field to string before returning
  return validate.convertObjId(user);
}

async function login(username, password) {
  if (!validate.validString(username))
    throw "Username must be a valid string.";
  if (!validate.validString(password))
    throw "Username must be a valid string.";
  const userCollection = await users();
  const user = await userCollection.findOne({
    userName: username.toLowerCase(),
  });

  if (!user) throw `invalid username or password`;
  let flag = false;
  try {
    flag = await bcrypt.compare(password, user.password);
  } catch (error) {
    throw error.message;
  }
  if (!flag) throw "Usern Name or Password does not match";
  return user;
}

async function createUser(
  userName,
  firstName,
  lastName,
  userImage,
  password,
  email,
  makeupLevel
) {

  userName = userName.toLowerCase();

  if (!validate.validString(userName))
    throw "user name must be a valid string.";
  if (!validate.validString(firstName))
    throw "First name must be a valid string.";
  if (!validate.validString(lastName))
    throw "Last name Category must be a valid string.";
  if (!validate.validString(password))
    throw "Password must be a valid string.";
  if (!validate.validEmail(email)) 
    throw "invalid Email";
  if (!validate.validString(userImage)) 
    userImage = "/public/uploads/profile.jpg";

  var regexuser = /^[a-zA-Z0-9]{4,}$/;

  if (!userName.match(regexuser)) {
    throw "Invalid Username";
  }
  if (password.length < 6 || password.includes(" ")) {
    throw "Invalid Password";
  }
  const userCollection = await users();
  const existUser = await userCollection.findOne({
    userName: userName,
  });
  if (existUser) {
    throw "Username already Exists";
  }
  const hash = await bcrypt.hash(password, saltRounds);

  const newUser = {
    userName: userName.trim(),
    userImage: userImage,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    password: hash,
    email: email.trim(),
    makeupLevel: makeupLevel,
    wishList: [],
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add User to database.";
  const id = insertInfo.insertedId.toString();

  return await getUserById(id);
}

async function updateUser(
  id,
  userName,
  userImage,
  firstName,
  lastName,
  password,
  email,
  makeupLevel
) {
  if (!validate.validString(userName))
    throw "user name must be a valid string.";
  if (
    userImage != null &&
    userImage.length != 0 &&
    !validate.validString(userImage)
  )
    throw "User picture path Invalid";
  if (!validate.validString(firstName))
    throw "First name must be a valid string.";
  if (!validate.validString(lastName))
    throw "Last name Category must be a valid string.";
  if (
    password != null &&
    password.length != 0 &&
    !validate.validString(password)
  ) {
    throw "Password must be a valid string.";
  }
  if (!validate.validEmail(email)) throw "invalid Email";
  if (!validate.validString(makeupLevel))
    throw "makeupLevel must be a valid string";

  var regexuser = /^[a-zA-Z0-9]{4,}$/;

  if (!userName.match(regexuser)) {
    throw "Invalid Username";
  }
  if (password != null && password.length != 0) {
    if (password.length < 6 || password.includes(" ")) {
      throw "Invalid Password";
    }
  }
  const userCollection = await users();

  const updateuser = {
    userName: userName.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    makeupLevel: makeupLevel.trim(),
  };

  if (password != null && password.length != 0) {
    const hash = await bcrypt.hash(password, saltRounds);
    updateuser.password = hash;
  }

  if (userImage != null && userImage.length != 0) {
    updateuser.userImage = userImage;
  }

  id = ObjectId(id);

  const updatedInfo = await userCollection.updateOne(
    { _id: id },
    { $set: updateuser }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update User";
  }

  return await getUserById(id.toString());
}

async function remove(id) {
  if (!validate.validString(id)) throw "User id must be a valid string.";

  const delUser = await getUserById(id);
  if (delUser == null) throw "User Not found";
  const userCollection = await users();
  id = ObjectId(id);
  const deletionInfo = await userCollection.deleteOne({ _id: id });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete User with id of ${id}`;
  }

  return `${delUser._id}`;
}

async function addToWishList(userId, prodId) {
  const userCollection = await users();
  const user = await getUserById(userId);
  const product = await getProductById(prodId);
  let flag = false;
  user.wishList.forEach((e) => {
    if (e == prodId) {
      flag = true;
     
    }
  });
  userId = ObjectId(userId);
  if (!flag) {
    const updatedInfo = await userCollection.updateOne(
      { _id: userId },
      { $push: { wishList: {prodId:prodId, prodName: product.productName }} }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not add to wishlist";
    }
  }
}

async function RemoveWishList(userId, prodId) {
  const userCollection = await users();
  const user = await getUserById(userId);

  userId = ObjectId(userId);
  
    const updatedInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { wishList: prodId } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not remove wishlist";
    }
  
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  remove,
  login,
  addToWishList,
  RemoveWishList
};
