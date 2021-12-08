const express = require("express");
const router = express.Router();
const data = require("../data");
const adminData = data.admin;

router.get("/", async (req, res) => {
  console.log("znan asdfasdf")
  return res.render("users/private", { users: req.session.user }); 
});
module.exports = router;
