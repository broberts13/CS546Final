const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = require("../data/admin");
const pendingData = require("../data/pending");
const productsData = require("../data/products");


router.get("/login", async (req, res) => {
  try {
    res.render("admin/adminlogin");
  } catch (e) {
    res.status(404).send({ error: e });
  }
});

router.post("/login", async (req, res) => {
  const {
    username,
    password,
  } = req.body;
  if (!username) {
    res.status(400).json({ error: "You must provide User name" });
    return;
  }
  if (!password) {
    res.status(400).json({ error: "You must provide password" });
    return;
  }
  //console.log(username, password);
  try {
    const admin = await adminData.login(username, password);
    const pending = await pendingData.getAll();
    // if (user.admin) {
    //   res.render("admin", {user: user})
    //   return;
    // }
    //console.log("login success", admin)
    res.render("admin/admin", { user: admin, pending: pending });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    const pending = await pendingData.getAll();
    // if (user.admin) {
    //   res.render("admin", {user: user})
    //   return;
    // }
    //console.log("login success", admin)
    res.render("admin/admin", { user: req.session.user, pending: pending });
  } catch (e) {

    res.status(400).send({ error: e });
  }
});

router.post("/addProd", async (req, res) => {
  const { productName,
    productPicture,
    productLinks,
    brand,
    price,
    category
  } = req.body
  if (!productName) {
    res.status(400).render("product/single", { error: "You must provide review title" });
    return;
  }
  if (!productPicture) {
    res.status(400).render("product/single", { error: "You must provide review before adding" });
    return;
  }
  if (!productLinks) {
    res.status(400).render("product/single", { error: "You must provide rating" });
    return;
  }

});

router.post("/deletePending", async (req, res) => {
  const first = await pendingData.getAll();
  try {
    const pending = req.body.pendingId;
    if (!pending) {
      throw "Please enter the id of the pending request."
    }
    const prodId = await pendingData.deletePending(pending);
    const pendingList = await pendingData.getAll();
    res.render("admin/admin", { pending: pendingList, success2: "pending request removed successfully" });
  } catch (e) {
    res.status(404).render("admin/admin", { pending: first, error2: e });
  }
});

router.post("/delete", async (req, res) => {
  const pendingList = await pendingData.getAll();
  try {
    const product = req.body.productId;
    if (!product) {
      throw "Please enter the id of the pending request."
    }
    const prodId = await productsData.remove(product);

    res.render("admin/admin", { pending: pendingList, success3: "product " + prodId + " removed successfully" });
  } catch (e) {
    res.status(404).render("admin/admin", { pending: pendingList, error3: e });
  }
});


router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
