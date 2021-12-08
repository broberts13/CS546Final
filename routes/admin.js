const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = data.admin;

router.get("/login", async (req, res) => {
  try {
    res.render("adminlogin");
  } catch (e) {
    res.status(404).send({ error: e });
  }
});


router.post("/", async (req, res) => {
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
      // if (user.admin) {
      //   res.render("admin", {user: user})
      //   return;
      // }
      //console.log("login success", admin)
      res.render("admin", { user: req.session.user });
  } catch (e) {

    res.status(400).send({ error: e });
  }
});

// router.get("/tttttt", async (req, res) => {
//   console.log("pillow asdfasdf")
//   return res.render("users/private", { users: req.session.user }); 
// });

router.post("/delete", async (req, res) => {
  try {
    const {
      productId
    } = req.body;
    const prodId = await adminData.removeProdById(productId);
    res.json({ deleted: true });
  } catch (e) {
    res.status(404).send({ error: e });
  }
});

router.get("/requests", async (req, res) =>{
  try{
    const reqProd = await adminData.getAllProdctsBystatus("pending");
    res.json({reqProd})
  }catch (e) {
    res.status(404).send({ error: e });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
