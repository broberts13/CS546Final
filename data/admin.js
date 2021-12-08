const mongoCollections = require("../config/mongoCollections");
const admin = mongoCollections.admin;
const products = mongoCollections.products;
const bcrypt = require("bcrypt");
const saltRounds = 16;
const validate = require("./validation");
const { ObjectId } = require("mongodb");


async function login(username, password) {
  if (!validate.validString(username))
    throw "User name must be a valid string.";
  if (!validate.validString(password))
    throw "User name must be a valid string.";
  // const adminCollection = await admin();
  // const admin = await adminCollection.findOne({
  //   username: username.toLowerCase(),
  // });
  //console.log("admin login method")
  return username == "admin" && password == "admin";
}

async function createAdmin(
  username,
  password
) {
  if (!validate.validString(username))
    throw "user name must be a valid string.";
  if (!validate.validString(password)) throw "Password must be a valid string.";
  
  var regexuser = /^[a-zA-Z0-9]{4,}$/;

  if (!username.match(regexuser)) {
    throw "Invalid Username";
  }
  if (password.length < 6 || password.includes(" ")) {
    throw "Invalid Password";
  }
  const adminCollection = await admin();
  const existadmin = await adminCollection.findOne({
    username: username.toLowerCase(),
  });
  if (existadmin) {
    throw "admin name alerady Exists";
  }
  const hash = await bcrypt.hash(password, saltRounds);

  const newAdmin = {
    username: username.trim(),
    password: hash,
  };

  const insertInfo = await adminCollection.insertOne(newAdmin);
  if (insertInfo.insertedCount === 0) throw "Could not add Admin to database.";

  return username;
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
  const adminCollection = await admin();

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

  const updatedInfo = await adminCollection.updateOne(
    { _id: id },
    { $set: updateuser }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update User";
  }

  return await getUserById(id.toString());
}

async function removeProdById(id) {
  if (!validate.validString(id)) throw "Product id must be a valid string.";

  const prodCollection = await products();
  objId = ObjectId(id);
  const deletionInfo = await prodCollection.deleteOne({ _id: objId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete Product with id of ${id}`;
  }

  return id;
}

async function getAllProdctsBystatus(){
  const prodCollection = await products();
  const allRequests = await prodCollection.find({status:"pending"}).toArray();
  if (allRequests === null) {
    return [];
  }
  let req = [];
  for (let request of allRequests) {
    let obj = {};
    obj["productName"] = request.productName;
    obj["brand"] = request.brand;
    req.push(obj);
  }
  return req;
}

module.exports = {
  createAdmin,
  updateUser,
  removeProdById,
  login,
  getAllProdctsBystatus,
};
