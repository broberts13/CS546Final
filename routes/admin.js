const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = require("../data/admin");
const pendingData = require("../data/pending");
const xss = require('xss');

router.get("/login", async (req, res) => {
  try {
    res.render("admin/adminlogin");
  } catch (e) {
    res.status(404).send({ error: e });
  }
});

router.post("/", async (req, res) => {
  const username = xss(req.body.username);
  const password = xss(req.body.password);
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
    res.render("admin/admin", {
      user: req.session.user,
      pending: pending,
      error: e,
    });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.post("/addProd", async (req, res) => {
  const productName = xss(req.body.productName);
  const productPicture = xss(req.body.productPicture);
  const productLinks = xss(req.body.productLinks);
  const brand = xss(req.body.brand);
  const price = xss(req.body.price);
  const category = xss(req.body.category);
  if (!productName) {
    res
      .status(400)
      .render("product/single", { error: "You must provide review title" });
    return;
  }
  if (!productPicture) {
    res
      .status(400)
      .render("product/single", {
        error: "You must provide review before adding",
      });
    return;
  }
  if (!productLinks) {
    res
      .status(400)
      .render("product/single", { error: "You must provide rating" });
    return;
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { productId } = req.body;
    const prodId = await adminData.removeProdById(productId);
    res.json({ deleted: true });
  } catch (e) {
    res.status(404).send({ error: e });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
