const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const productData = data.products;
const xss = require("xss");

router.get("/", async (req, res) => {
  if (req.session.user == null) {
    return res.redirect("/login?error=Please login to continue");
  }
  try {
    const users = await userData.getUserById(req.session.user._id.toString());
    const userReviews = await productData.getUserReviews(
      req.session.user._id.toString()
    );
    let wishlistProd = [];
    if (users.wishList.length != null) {
      users.wishList.forEach((e) => {
        wishlistProd.push(e);
      });
    }

    const products = await productData.findWishlistProd(wishlistProd);

    res.render("users/users", {
      users: users,
      products: products,
      userReviews: userReviews,
      user: req.session.user,
    });
  } catch (e) {
    res
      .status(404)
      .render("landing/error", { error: e, user: req.session.user });
  }
});

router.post("/wishlist/:prodId", async (req, res) => {
  try {
    if (!req.session.user) {
      throw "Login, to add product in Wishlist";
    }
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

router.post("/profile", async (req, res) => {
  const userImage = xss(req.body.userImage);
  const firstName = xss(req.body.firstName);
  const lastName = xss(req.body.lastName);
  const password = xss(req.body.password);
  const email = xss(req.body.email);
  const makeupLevel = xss(req.body.makeupLevel);
  const userName = req.session.user.userName;
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

  if (!email) {
    res.status(400).json({ error: "You must provide email Id" });
    return;
  }
  if (!makeupLevel) {
    res.status(400).json({ error: "You must provide makeup level" });
    return;
  }
  if (
    req.session.user.userImage == userImage &&
    req.session.user.firstName == firstName &&
    req.session.user.lastName == lastName &&
    req.session.user.email == email &&
    req.session.user.makeupLevel == makeupLevel &&
    password == ""
  ) {
    res.status(400).json({ error: "Data is Up-to-date" });
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
    res.render("users/users", { user: req.session.user });
  } catch (e) {
    res.status(400).send({ error: e });
    return;
  }
});

router.post("/signup", async (req, res) => {
  const userName = xss(req.body.userName);
  const userImage = xss(req.body.userImage);
  const firstName = xss(req.body.firstName);
  const lastName = xss(req.body.lastName);
  const password = xss(req.body.password);
  const email = xss(req.body.email);
  const makeupLevel = xss(req.body.makeupLevel);
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
    const user = await userData.createUser(
      userName,
      userImage,
      firstName,
      lastName,
      password,
      email,
      makeupLevel
    );
    req.session.user = user;
    res.render("users/users", { user: user });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.put("/users", async (req, res) => {
  const userName = xss(req.body.userName);
  const userImage = xss(req.body.userImage);
  const firstName = xss(req.body.firstName);
  const lastName = xss(req.body.lastName);
  const password = xss(req.body.password);
  const email = xss(req.body.email);
  const makeupLevel = xss(req.body.makeupLevel);
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
    res
      .status(404)
      .render("landing/error", { error: e, user: req.session.user });
  }
});

// router.post("/delete/:id", async (req, res) => {
//   try {
//     const user = await userData.remove(req.params.id);
//     // res.json({ userId: userId, deleted: true });

//     req.session.destroy();
//     res.redirect("/login");
//   } catch (e) {
//     res.status(404).send({ error: e });
//   }
// });

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
