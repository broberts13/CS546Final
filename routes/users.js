const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const reviewData = data.reviews;


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

router.get("/id/:id", async (req, res) => {
  try {
    const users = await userData.getUserById(req.params.id);
    const reviews = await reviewData.getReviewsByField(null, req.params.id, null, null, null , null);
    res.render("users/profile", { users: users, reviews: reviews, user: req.session.user });
  } catch (e) {
    res.status(404).render("landing/error", { error: e });
  }
});

router.get("/private", async (req, res) => {
  return res.render("users/private", { users: req.session.user }); 
});

router.post("/login", async (req, res) => {
  if(!req.body){
    res.status(401).render("users/login", {title: "Log In", error: "Error: Username or password was not provided"});
  }
  const { username, password } = req.body;
  if (!username) {
    res.status(400).render("users/login", {title: "Log In", error: "You must provide an email"});
    return;
  }
  if (!password) {
    res.status(400).render("users/login", {title: "Log In", error: "You must provide a password"});
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
  if(!req.body){
    res.status(401).render("users/signup", {error: "Please fill out all fields"});
  }
  let formBody = req.body;
  
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const makeupLevel = req.body.makeupLevel;


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
  
  else {
    let userAdded;
    try {
       userAdded = await userData.createUser(
        username,
        firstName,
        lastName,
        password,
        email,
        makeupLevel
      );
      req.session.user = userAdded;
    } catch(e) {
      res.status(400).render("users/signup", {title: "Sign Up", error: "Error: " + e});
    }
    if(!userAdded){
      res.status(500).render("users/signup", {title: "Sign Up", error: "Error: Internal Server Error"});
    }
    else if(userAdded){
      res.render("users/login");
      return;
    }
    else{
      res.status(500).render("users/signup", {title: "Sign Up", error: "Error: Internal Server Error"});
    }
    
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


router.post("/private", async (req, res) => {
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
  // if (!userImage) {
  //   res.status(400).json({ error: "You must provide User picture" });
  //   return;
  // }
  if (!firstName) {
    res.status(400).json({ error: "You must provide User's firstName" });
    return;
  }
  if (!lastName) {
    res.status(400).json({ error: "You must provide User's lastName" });
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
      req.session.user._id,
      userName,
      userImage,
      firstName,
      lastName,
      password,
      email,
      makeupLevel
    );
    req.session.user = user;
    res.redirect("/users");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});



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
    res.status(404).send({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = await userData.remove(req.params.id);
    res.json({ userId: userId, deleted: true });
  } catch (e) {
    res.status(404).send({ error: e });
  }
});




module.exports = router;
