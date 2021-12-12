const express = require("express");
const router = express.Router();
const adminData = require("../data/admin");
const pendingData = require("../data/pending");
const productsData = require("../data/products");
const xss = require('xss');

function checkAdmin(req, res) {
  if (!req.session.admin) {
    res.status(401).json({ error: "Not Authorized!"});
    return
  }
}

router.get("/login", async (req, res) => {
  try {
    res.render("admin/adminlogin");
  } catch (e) {
    res.status(404).send({ error: e });
  }
});

router.post("/login", async (req, res) => {
  const username = xss(req.body.username);
  const password = xss(req.body.password);
  if (!username) {
    res.render("admin/adminlogin",{ error: "You must provide User name" });
    return;
  }
  if (!password) {
    res.render("admin/adminlogin",{ error: "You must provide password" });
    return;
  }
  
  try {
    const admin = await adminData.login(username, password);
    if (!admin) {
      res.render("admin/adminlogin",{ error: "You are not authorized" });
      return;
    }
    const pending = await pendingData.getAll();

    req.session.admin = admin;

    res.render("admin/admin", {admin:req.session.admin, pending: pending });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.get("/", async (req, res) => {
  try {
    if (!req.session.admin) {
      res.redirect("/admin/login")
      return
    }
    const pending = await pendingData.getAll();
    res.render("admin/admin", {admin:req.session.admin, pending: pending });
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
  checkAdmin(req, res);
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
  checkAdmin(req, res);
  const first = await pendingData.getAll();
  try {
    const pending = req.body.pendingId;
    if (!pending) {
      throw "Please enter the id of the pending request."
    }
    const pendingId = await pendingData.deletePending(pending);
    const pendingList = await pendingData.getAll();
    res.render("admin/admin", {admin:req.session.admin, pending: pendingList, success2: "Pending "+pendingId+" request removed successfully" });
  } catch (e) {
    res.status(404).render("admin/admin", { pending: first, error2: e });
  }
});

router.post("/delete", async (req, res) => {
  checkAdmin(req, res);
  const pendingList = await pendingData.getAll();
  try {
    const product = req.body.productId;
    if (!product) {
      throw "Please enter the id of the pending request."
    }
    const prodId = await productsData.remove(product);

    res.render("admin/admin", {admin:req.session.admin, pending: pendingList, success3: "product " + prodId + " removed successfully" });
  } catch (e) {
    res.status(404).render("admin/admin", { pending: pendingList, error3: e });
  }
});


router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
