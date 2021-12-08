const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const productData = data.products;


router.get("/", async (req, res) => {
  if(req.session.user == null) {
    return res.redirect("/login?error=Please login to continue");
  }

router.get("/login", async (req, res) => {
  return res.render("users/login", { user: req.session.user });
});

router.get("/signup", async (req, res) => {
  return res.render("users/signup"); //add a redirect to account page if user authenticated??
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  try {
    req.params.id
    const users = await userData.getUserById(req.params.id);
    const userReviews = await productData.getUserReviews(req.params.id);
    let wishlistProd = [];
    if (users.wishList.length != null) {
      users.wishList.forEach((e) => {
        wishlistProd.push(e);
      });
    }

    const products = await productData.findWishlistProd(wishlistProd);

    res.render("users/profile", {
      users: users,
      products: products,
      reviews: userReviews,
      user: req.session.user,
    });
  } catch (e) {
    res.status(404).render("landing/error", { error: e });
  }
});


router.get("/private/:id", async (req, res) => {
  const users = await userData.getUserById(req.session.user._id.toString());

  return res.render("users/private", { users: users, user: req.session.user });
});

router.post("/login", async (req, res) => {
  if (!req.body) {
    res.status(401).render("users/login", { title: "Log In", error: "Error: Username or password was not provided" });
  }
  const { username, password } = req.body;
  if (!username) {
    res.status(400).render("users/login", { title: "Log In", error: "You must provide an email" });
    return;
  }
  if (!password) {
    res.status(400).render("users/login", { title: "Log In", error: "You must provide a password" });
    return;
  }
  try {
    const user = await userData.login(username, password);
    req.session.user = user;
    res.render("landing/landing", { user: req.session.user });
  } catch (e) {
    res.render("users/login", { user: req.session.user, error: e });
  }
});



router.post("/signup", async (req, res) => {
  if (!req.body) {
    res.status(401).render("users/signup", { error: "Please fill out all fields" });
  }
  let formBody = req.body;

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const userImage = req.body.imageUpload;
  const email = req.body.email;
  const makeupLevel = req.body.makeupLevel;

  try {
    if (!firstName) {
      res.status(400).render("users/signup",{title: "Sign Up", error: "You must provide a first name", post: formBody });
    }
    else if (!lastName) {
      res.status(400).render("users/signup",{title: "Sign Up",  error: "You must provide a last name" , post: formBody});
    }
    else if (!username) {
      res.status(400).render("users/signup",{title: "Sign Up", error: "You must provide a username" , post: formBody});
    }
    else if (!password) {
      res.status(400).render("users/signup",{title: "Sign Up", error: "You must provide password" , post: formBody});
    }
    else if (!email) {
      res.status(400).render("users/signup",{title: "Sign Up", error: "You must provide an email" , post: formBody});
    }
    
    const userAdded = await userData.createUser(
        username,
        firstName,
        lastName,
        userImage,
        password,
        email,
        makeupLevel
      );
      req.session.user = userAdded;

    if(!userAdded){
      res.status(500).render("users/signup", {title: "Sign Up", error: "Error: Internal Server Error"});
    }
    else if (userAdded) {
      res.render("users/login");
      return;
    }
    else{
      res.status(500).render("users/signup", {title: "Sign Up", error: "Error: Internal Server Error"});
    }  
  } 
  catch(e) {
    res.status(400).render("users/signup", {title: "Sign Up", error: "Error: " + e});
  }
});

router.post("/wishlist/:prodId", async (req, res) => {
  try {
    await userData.addToWishList(
      req.session.user._id.toString(),
      req.params.prodId
    );
    return res.json("Success");
  } catch (e) {
    return res.status(404).send({ error: e });
  }
});

router.post("/wishlist/remove/:prodId", async (req, res) => {
  try {
    await userData.RemoveWishList(
      req.session.user._id.toString(),
      req.params.prodId
    );
    return res.json("Success");
  } catch (e) {
    return res.status(404).send({ error: e });
  }
});

//router.post("/profile", async (req, res) => {
router.post("/private/:id", async (req, res) => {
  const {
    username,
    userImage,
    firstName,
    lastName,
    password,
    email,
    makeupLevel,
  } = req.body;
 const users = await userData.getUserById(req.session.user._id.toString());
  try {
  if (!username) {
    throw "You must provide User name";
  }
    // if (!userImage) {
    //   res.status(400).json({ error: "You must provide User picture" });
    //   return;
    // }
  else if (!firstName) {
    throw "You must provide User's firstName";
  }
  else if (!lastName) {
    throw "You must provide User's lastName";
  }
  else if (!email) {
    throw "You must provide email Id";
  }
  else if (!makeupLevel) {
    throw "You must provide makeup level";
  } 
  else if(req.session.user.userName == userName && req.session.user.userImage==userImage && req.session.user.firstName == firstName && req.session.user.lastName==lastName && req.session.user.email==email && req.session.user.makeupLevel==makeupLevel){
    throw "Data is Up-to-date";
  }
    const user = await userData.updateUser(
      req.session.user._id,
      username,
      userImage,
      firstName,
      lastName,
      password,
      email,
      makeupLevel
    );
    req.session.user = user;
    res.render("users/private", { users: user, success: "Profile updated successfully", user: req.session.user });
  } catch (e) {
    res.status(400).render("users/private", { users: users, error: e, user: req.session.user });
  }
});  

/*
router.put("/private", async (req, res) => {
  const {
    userName,
    userImage,
    firstName,
    lastName,
    password,
    email,
    makeupLevel,
  } = req.body;
  if (!userName) {
    res.status(400).json({ error: "You must provide User name" });
    return;
  }
  if (!userImage) {
    res.status(400).json({ error: "You must provide User picture" });
    return;
  }
  if (!firstName) {
    res.status(400).json({ error: "You must provide User's firstName" });
    return;
  }
  if (!lastName) {
    res.status(400).json({ error: "You must provide User's lastName" });
    return;
  }
  if (!password) {
    res.status(400).json({ error: "You must provide password" });
    return;
  }
  if (!email) {
    res.status(400).json({ error: "You must provide email Id" });
    return;
  }
  if (!makeupLevel) {
    res.status(400).json({ error: "You must provide makeup level" });
    return;
  }
  try {
    const user = await userData.updateUser(
      req.params.id,
      userName,
      userImage,
      firstName,
      lastName,
      password,
      email,
      makeupLevel
    );
    res.json(user);
  } catch (e) {
    console.log("znan put", e)
    res.status(404).send({ error: e });
  }
});
*/
router.post("/delete/:id", async (req, res) => {
  try {
    const user = await userData.remove(req.params.id.toString());
    res.json({ userId: userId, deleted: true });

    req.session.destroy();
    res.redirect("/login");
  } catch (e) {
    res.status(404).send({ error: e });
  }
});




module.exports = router;
