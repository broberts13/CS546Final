const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
var session = require("express-session");
var expressValidator = require("express-validator");
const { check, validationResult } = require("express-validator");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,

    cookie: { maxAge: 300000 },
  })
);

app.use("/login", (req, res, next) => {
  if(req.session.user != null) {
    return res.redirect("/");
  }
  next();
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
